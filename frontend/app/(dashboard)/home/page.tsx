"use client"

import { Button, Card, Skeleton, CopyAddress } from "@/components/ui"
import { processTx, mistToSui, formatSuiAmount, truncateAddress } from "@/lib/utils"
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, ArrowDownLeft, Zap, Pencil, Eye, CheckCircle2,
  X, RefreshCcw, ArrowDown, ArrowUp, Send, DownloadCloud, SendHorizontal,
  Plus, AtSign, Sparkles, Bot, Users, Square, Trash2, Bell, Scale, Minus,
  Wallet, Info, HelpingHand, ChevronDown, ChevronUp, Utensils, Home, ShoppingCart, ShoppingBag, MessageSquare
} from "lucide-react"
import { useState, useRef, useEffect, useMemo } from "react"
import { motion as Motion, AnimatePresence } from "motion/react"
import { useRouter } from "next/navigation"
import { useModal, useGetBalances, useGetDetailTransactions, useMindyAgent, useMindyInsight, usePaymentRequests, useTransactionManager } from "@/hooks"
import { SendTransactionModal, RequestTransactionModal } from "@/components/transactionModal"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { MindyAILogo, SuiMindLogo } from "@/components/icons"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { playSound } from "@/lib/sound-effects"
import { toast } from "sonner"
import { TX_DESC_STORAGE_REBATE, TX_DESC_CONTRACT_INTERACTION } from "@/lib/constants";
import { db } from "@/lib/firebase"; // Import your initialized db
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { HOME_PAGE_INSIGHTS, HOME_PAGE_SUGGESTIONS, getHomeInsightsContextPrompt, getHomeSuggestionsContextPrompt } from "@/lib/prompts";



export default function HomePage() {
  const router = useRouter()
  const account = useCurrentAccount()

  // signTransaction handled in hook
  const { isSending, transferSui, createPaymentRequest, rejectRequest, deleteNotification } = useTransactionManager();

  const { data: balanceData, isLoading: isBalanceLoading, refetch } = useGetBalances();
  const walletBalance = balanceData?.totalBalance ? mistToSui(balanceData.totalBalance) : 0;
  const { data: transactionData, isLoading: isTransactionLoading, refetch: refetchTransactions } = useGetDetailTransactions(20);

  const onTransactionSuccess = async () => {
    await refetch();
    if (refetchTransactions) await refetchTransactions();
  };

  const [showNewSendUI, setShowSendUI] = useState(false);
  const [showNewRequestUI, setShowRequestUI] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [requestRecipient, setRequestRecipient] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [activeRequestObject, setActiveRequestObject] = useState<any>(null);
  const [recentRecipients, setRecentRecipients] = useState<string[]>([]);


  useEffect(() => {
    const saved = localStorage.getItem('recent_recipients');
    if (saved) setRecentRecipients(JSON.parse(saved));
  }, []);

  const saveRecipient = (address: string) => {
    const updated = [address, ...recentRecipients.filter(a => a !== address)].slice(0, 5);
    setRecentRecipients(updated);
    localStorage.setItem('recent_recipients', JSON.stringify(updated));
  };

  const handleSend = async (data: { recipient: string; amount: string; remark?: string; remarkCategory?: string }) => {
    const { recipient: sendRecipient, amount: sendAmount, remark: sendRemark, remarkCategory: sendRemarkCategory } = data;

    // Use local variables from arguments instead of state
    const execution = await transferSui({
      amount: sendAmount,
      recipient: sendRecipient,
      paymentRequestId: activeRequestObject?.id,
      walletBalance,
    });

    if (execution) {
      const digest = execution?.effects?.transaction?.digest;
      if (digest) {
        try {
          await setDoc(doc(db, "transactions", digest), {
            sender: account?.address,
            recipient: sendRecipient,
            amountSui: sendAmount,
            remark: sendRemark || "No remark",
            timestamp: serverTimestamp(),
          });

          // Continue with your success logic
          await onTransactionSuccess();
          // The modal handles its own success state. We just need to clean up data.
          setActiveRequestObject(null);
          refetch();
          saveRecipient(sendRecipient);
        } catch (dbError) {
          console.error("Firestore write failed:", dbError);
        }
      }
    } else {
      // This runs if execution was 'false' (transaction failed or cancelled)
      console.error("Transaction failed or was cancelled.");
    }
  };

  const handleRequest = async (data: { recipient: string; amount: string; remark?: string; remarkCategory?: string }) => {
    const { recipient: reqRecipient, amount: reqAmount, remark: reqRemark, remarkCategory: reqCategory } = data;

    const requestCode = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const execution = await createPaymentRequest({
      amount: reqAmount,
      recipient: reqRecipient,
      code: requestCode
    });

    if (execution) {
      const digest = execution?.effects?.transaction?.digest;
      if (digest) {
        try {
          // Save to request_remarks collection for cleaner lookup
          await setDoc(doc(db, "request_remarks", requestCode), {
            remark: reqRemark || "No remark",
            timestamp: serverTimestamp(),
            category: reqCategory || 'Other'
          });

          // Also save to transactions for record keeping (optional but good for history)
          await setDoc(doc(db, "transactions", digest), {
            sender: account?.address,
            recipient: reqRecipient,
            amountSui: reqAmount,
            remark: reqRemark || "No remark",
            timestamp: serverTimestamp(),
            requestCode: requestCode
          });

          // Modal handles success UI
          saveRecipient(reqRecipient);
        } catch (dbError) {
          console.error("Firestore write failed:", dbError);
        }
      }
    }
  };

  useEffect(() => {
    const handlePayFromHeader = (event: any) => {
      const request = event.detail;
      setRecipient(request.requester);
      setAmount(request.amountSui.toString());
      setActiveRequestObject(request);
      setShowSendUI(true);
    };

    window.addEventListener('PAY_REQUEST', handlePayFromHeader);
    return () => window.removeEventListener('PAY_REQUEST', handlePayFromHeader);
  }, []);

  useEffect(() => {
    const handleRejectRequest = async (event: any) => {
      const requestId = event.detail;
      const success = await rejectRequest(requestId);
      if (success) {
        await onTransactionSuccess();
        refetch();
      }
    };

    window.addEventListener('REJECT_REQUEST', handleRejectRequest);
    return () => window.removeEventListener('REJECT_REQUEST', handleRejectRequest);
  }, [rejectRequest, refetch, onTransactionSuccess]);



  useEffect(() => {
    const handleClearPaid = async (event: any) => {
      const objectId = event.detail;
      const success = await deleteNotification(objectId, 'paid');
      if (success) {
        await onTransactionSuccess();
      }
    };

    window.addEventListener('CLEAR_PAID_NOTIFICATION', handleClearPaid);
    return () => window.removeEventListener('CLEAR_PAID_NOTIFICATION', handleClearPaid);
  }, [deleteNotification, onTransactionSuccess]);

  useEffect(() => {
    const handleClearReject = async (event: any) => {
      const objectId = event.detail;
      const success = await deleteNotification(objectId, 'reject');
      if (success) {
        await onTransactionSuccess();
      }
    };

    window.addEventListener('CLEAR_REJECT_NOTIFICATION', handleClearReject);
    return () => window.removeEventListener('CLEAR_REJECT_NOTIFICATION', handleClearReject);
  }, [deleteNotification, onTransactionSuccess]);


  // ==============  Balance & Recent Transaction  ==============  


  // Play sound when new notifications arrive
  const prevBalance = useRef(0)
  const isFirstLoadBalance = useRef(true)

  useEffect(() => {
    if (isBalanceLoading) return;

    if (isFirstLoadBalance.current) {
      prevBalance.current = walletBalance;
      isFirstLoadBalance.current = false;
      return;
    }

    if (walletBalance > prevBalance.current) {
      // Double sound
      playSound('received');
      playSound('received_background')
    }
    prevBalance.current = walletBalance;
  }, [walletBalance, isBalanceLoading]);

  const recentTransactions = useMemo(() => {
    return (transactionData?.transactions
      ?.map((tx: any) => processTx(tx, account?.address))
      .filter((tx): tx is NonNullable<typeof tx> => tx !== null) || []).slice(0, 5);
  }, [transactionData, account?.address]);


  // ==============  Mindy Chat  ==============  
  const [mindyInput, setMindyInput] = useState("")
  const { messages: mindyMessages, isLoading: isMindyLoading, sendMessage: sendMindyMessage, startSession: startMindySession } = useMindyAgent()
  const mindyMessagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mindyMessages.length > 0) {
      mindyMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [mindyMessages])

  const handleMindySend = () => {
    if (!mindyInput.trim()) return
    sendMindyMessage(mindyInput)
    setMindyInput("")
  }

  // ============   MOCK   ============
  const [salary, setSalary] = useState("0")
  const [activeSalary, setActiveSalary] = useState("0.00")
  const [passiveSalary, setPassiveSalary] = useState("0.00")

  // Use reusable modal hook for all modals
  const salaryModal = useModal()
  const expensesModal = useModal()

  const [expenseCategories] = useState([
    { id: 1, name: "Rent & Utilities", amount: "1200", icon: "🏠" },
    { id: 2, name: "Groceries", amount: "400", icon: "🛒" },
    { id: 3, name: "Transportation", amount: "150", icon: "🚗" },
    { id: 4, name: "Entertainment", amount: "200", icon: "🎬" },
    { id: 5, name: "Healthcare", amount: "100", icon: "🏥" },
  ])

  const calculateBalance = () => {
    const salaryNum = Number.parseFloat(salary) || 0
    const totalExpenses = expenseCategories.reduce((acc, curr) => acc + Number(curr.amount), 0)
    return salaryNum - totalExpenses
  }

  const totalExpenses = expenseCategories.reduce((acc, curr) => acc + Number(curr.amount), 0)
  const balance = calculateBalance()

  // ==============  AI Insight  ==============  
  const insightModal = useModal()
  const {
    insight,
    isLoading: isInsightLoading,
    error: insightError,
    fetchInsight,
    regenerateInsight
  } = useMindyInsight();

  const handleRegenerateInsight = () => {
    regenerateInsight(HOME_PAGE_INSIGHTS, getHomeInsightsContextPrompt({
      balance: walletBalance,
      totalExpenses,
      expenseCategories,
      recentActivity: recentTransactions
    }));
  };

  // Auto-fetch insight when modal opens
  useEffect(() => {
    if (insightModal.isOpen && !insight && !isInsightLoading && !insightError) {
      fetchInsight(HOME_PAGE_INSIGHTS, getHomeInsightsContextPrompt({
        balance: walletBalance,
        totalExpenses,
        expenseCategories,
        recentActivity: recentTransactions
      }));
    }
  }, [insightModal.isOpen, recentTransactions, insight, isInsightLoading, insightError]); // Added missing deps for correctness

  // ==============  AI Powered Suggestions  ==============  
  const [suggestions, setSuggestions] = useState<any[]>([])

  const {
    insight: rawSuggestions,
    isLoading: isSuggestionsLoading,
    error: suggestionsError,
    fetchInsight: fetchSuggestions,
    regenerateInsight: regenerateSuggestions
  } = useMindyInsight();

  const handleRegenerateSuggestions = () => {
    regenerateSuggestions(HOME_PAGE_SUGGESTIONS, getHomeSuggestionsContextPrompt({
      balance: walletBalance,
      totalExpenses,
      expenseCategories,
      recentActivity: recentTransactions
    }));
  };

  // Auto-fetch suggestions on load
  useEffect(() => {
    // Add suggestionsError check to prevent infinite loop on failure
    if (!rawSuggestions && !isSuggestionsLoading && !suggestionsError && recentTransactions.length > 0) {
      fetchSuggestions(HOME_PAGE_SUGGESTIONS, getHomeSuggestionsContextPrompt({
        balance: walletBalance,
        totalExpenses,
        expenseCategories,
        recentActivity: recentTransactions
      }));
    }
  }, [rawSuggestions, isSuggestionsLoading, suggestionsError, recentTransactions]);

  // Update suggestions when AI returns data
  useEffect(() => {
    if (rawSuggestions) {
      try {
        // Find JSON array in the response (in case AI adds extra text)
        const jsonMatch = rawSuggestions.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsedSuggestions = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsedSuggestions) && parsedSuggestions.length > 0) {
            setSuggestions(parsedSuggestions);
          }
        }
      } catch (e) {
        console.error("Failed to parse AI suggestions", e);
      }
    }
  }, [rawSuggestions]);

  // ======================================================

  return (
    <div className="w-full px-6 py-8">
      {/* Main Balance Card */}
      <Card className="border-white/20 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/5 mb-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FBEE5]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative p-5 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left side: Balance + AI Insight */}
            <div className="flex-1">
              <p className="text-white text-lg sm:text-3xl font-bold mb-2">Total Balance</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold break-all" style={{ color: "white" }}>
                  {isBalanceLoading ? (
                    <Skeleton className="h-10 sm:h-14 lg:h-[4.5rem] w-24 sm:w-40 bg-white/10 rounded-xl" />
                  ) : (
                    `${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })} SUI`
                  )}
                </h2>
                {/* AI Insight beside the number */}
                <div
                  className="group relative overflow-hidden flex items-center justify-between px-9 py-5 rounded-[20px] bg-black/20 border border-white/10 cursor-pointer hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] self-start sm:self-center min-w-[380px] backdrop-blur-md"
                  onClick={insightModal.open}
                >
                  {/* Hover Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6FBEE5]/10 to-[#A890FE]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Left Side: Icon + Text */}
                  <div className="relative z-10 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="bg-transparent w-15 h-15 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MindyAILogo className="w-15 h-15 text-[#6FBEE5]" />
                      </div>
                      <h4 className="text-lg font-black text-white tracking-wide">Mindy AI Insight</h4>
                    </div>
                    <p className="text-sm font-medium text-white/50 group-hover:text-white/80 transition-colors pl-1">Tap for analysis</p>
                  </div>

                  <div className="relative z-10 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-gradient-to-r group-hover:from-[#3B82F6] group-hover:to-[#9333EA] group-hover:border-white transition-all duration-300 group-hover:rotate-45 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <ArrowUpRight className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Send & Request Buttons */}
            <div className="flex flex-row lg:flex-col gap-4">
              <Button
                onClick={() => setShowSendUI(true)}
                disabled={isSending || !account}
                className="flex-1 lg:flex-none lg:min-w-[210px] py-6 sm:py-10 text-base sm:text-lg font-bold bg-[#6FBEE5]/30 hover:bg-[#6FBEE5]/20 text-white border border-[#6FBEE5] rounded-2xl transition-all duration-300 group relative flex items-center justify-center overflow-hidden"
              >
                <div className="w-[150px] flex items-center gap-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#6FBEE5]/40 border border-[#6FBEE5] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#6FBEE5] transition-all duration-300 shrink-0 shadow-lg shadow-[#6FBEE5]/20">
                    <SendHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-colors" />
                  </div>
                  <span className="leading-none text-[#CCEEFF] group-hover:text-white transition-colors font-black tracking-tight text-xl translate-y-[1px]">Send</span>
                </div>
              </Button>
              <Button
                onClick={() => setShowRequestUI(true)}
                className="flex-1 lg:flex-none lg:min-w-[210px] py-6 sm:py-10 text-base sm:text-lg font-bold bg-[#34D399]/30 hover:bg-[#34D399]/20 text-white border border-[#34D399] rounded-2xl transition-all duration-300 group relative flex items-center justify-center overflow-hidden"
              >
                <div className="w-[150px] flex items-center gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#34D399]/40 border border-[#34D399] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#34D399] transition-all duration-300 shrink-0 shadow-lg shadow-[#34D399]/20">
                    <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-colors" />
                  </div>
                  <span className="leading-none text-[#CCFCDF] group-hover:text-white transition-colors font-black tracking-tight text-xl translate-y-[1px]">Request</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <SendTransactionModal
        isOpen={showNewSendUI}
        onClose={() => setShowSendUI(false)}
        walletBalance={walletBalance}
        isSending={isSending}
        onConfirm={handleSend}
        recentRecipients={recentRecipients}
        initialRecipient={recipient}
        initialAmount={amount}
      />

      <RequestTransactionModal
        isOpen={showNewRequestUI}
        onClose={() => setShowRequestUI(false)}
        isSending={isSending}
        onConfirm={handleRequest}
        recentRecipients={recentRecipients}
        initialRecipient={requestRecipient}
        initialAmount={requestAmount}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="md:col-span-2 xl:col-span-2">
          <Card className="border-white/20 backdrop-blur-xl bg-white/5 lg:h-[70vh]">
            <div className="p-6">
              <Button
                variant="ghost"
                className="justify-start text-2xl sm:text-3xl text-white font-black mb-10 p-0 h-auto hover:bg-transparent hover:scale-[1.05] transition-transform"
                onClick={() => router.push('/insights')}
              >
                Monthly Cashflow
              </Button>
              <div className="space-y-6">
                {/* Salary Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="salary" className="text-sm font-medium text-white">
                      Monthly Salary
                    </label>
                    <button
                      type="button"
                      onClick={salaryModal.open}
                      className="cursor-pointer group flex items-center gap-2 text-[#6FBEE5] hover:text-[#5DAED5] transition-all hover:scale-105 active:scale-95"
                    >
                      <Pencil className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-base font-bold underline underline-offset-4 decoration-[#6FBEE5]/40 group-hover:decoration-[#5DAED5]">
                        Edit Salary
                      </span>
                    </button>
                  </div>

                  {/* Active/Passive Display */}
                  <div className="flex gap-6 mb-4">
                    <div className="text-xs sm:text-sm text-white/60 font-medium uppercase tracking-wider">
                      Active: <span className="text-[#6FBEE5] font-bold text-base sm:text-lg">${Number(activeSalary).toLocaleString()}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-white/60 font-medium uppercase tracking-wider">
                      Passive: <span className="text-[#6FBEE5] font-bold text-base sm:text-lg">${Number(passiveSalary).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-3xl font-black">$</span>
                    <input
                      id="salary"
                      type="number"
                      placeholder="0.00"
                      value={salary}
                      readOnly
                      className="w-full pl-12 pr-6 py-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none transition-all text-3xl font-black cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Expenses Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="expenses" className="text-sm font-medium text-white">
                      Monthly Expenses
                    </label>
                    <button
                      type="button"
                      onClick={expensesModal.open}
                      className="cursor-pointer group flex items-center gap-2 text-[#6FBEE5] hover:text-[#5DAED5] transition-all hover:scale-105 active:scale-95"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="text-base font-bold underline underline-offset-4 decoration-[#6FBEE5]/40 group-hover:decoration-[#5DAED5]">
                        View More
                      </span>
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-3xl font-black">$</span>
                    <input
                      id="expenses"
                      type="number"
                      placeholder="0.00"
                      value={totalExpenses}
                      readOnly
                      className="w-full pl-12 pr-6 py-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none transition-all text-3xl font-black cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 gap-4">
                    <div className="min-w-0">
                      <p className="text-white/60 text-sm sm:text-base mb-2">Available Balance</p>
                      {balance > 0 ? (
                        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-sky-400 truncate">
                          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      ) : balance === 0 ? (
                        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white truncate">
                          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      ) : (
                        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-400 truncate">
                          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                    <div
                      className={`px-6 py-3 sm:px-8 sm:py-4 rounded-2xl self-start sm:self-center shrink-0 shadow-lg ${balance > 0 ? "bg-green-500/20 text-green-500 shadow-green-500/10" :
                        balance < 0 ? "bg-red-500/20 text-red-500 shadow-red-500/10" :
                          "bg-white/10 text-white shadow-white/5"
                        }`}
                    >
                      {balance > 0 ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <TrendingUp className="w-6 h-6 sm:w-5 sm:h-5" />
                          <span className="text-base sm:text-xl font-black uppercase tracking-wider">Surplus</span>
                        </div>
                      ) : balance < 0 ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <TrendingUp className="w-6 h-6 sm:w-5 sm:h-5 rotate-180" />
                          <span className="text-base sm:text-xl font-black uppercase tracking-wider">Deficit</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Minus className="w-6 h-6 sm:w-5 sm:h-5" />
                          <span className="text-base sm:text-xl font-bold uppercase tracking-wider">Balanced</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-1">
          <Card className="border-white/20 backdrop-blur-xl bg-white/5 lg:h-[70vh]">
            <div className="p-6 h-full flex flex-col">
              <Button
                variant="ghost"
                className="justify-start text-2xl sm:text-3xl text-white font-black mb-10 p-0 h-auto hover:bg-transparent hover:scale-[1.04] transition-transform"
                onClick={() => router.push('/recent-activity')}
              >
                Recent Activity
              </Button>
              <div className="space-y-6 flex-1 pt-12 -mt-12">
                {isTransactionLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="flex items-start gap-3 pb-6 border-b border-white/10 last:border-0 last:pb-0"
                    >
                      {/* Icon Skeleton */}
                      <Skeleton className="w-10 h-10 rounded-full shrink-0" />

                      {/* Text Skeleton */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-32 mt-1" />
                      </div>

                      {/* Amount Skeleton */}
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))
                ) : (
                  recentTransactions.map((tx, index) => (
                    <div
                      key={tx.id || `tx-${index}`}
                      className="flex items-start gap-3 pb-6 border-b border-white/10 last:border-0 last:pb-0"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg shrink-0 ${tx.type === "receive"
                          ? "bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/20"
                          : tx.type === "send"
                            ? "bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/20"
                            : "bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/20"
                          }`}
                      >
                        {tx.label === "Sui Storage Rebate" ? (
                          <HelpingHand className="w-5 h-5 text-white stroke-[2px]" />
                        ) : tx.type === "receive" ? (
                          <ArrowDownLeft className="w-5 h-5 text-white stroke-[3px]" />
                        ) : tx.type === "send" ? (
                          <ArrowUpRight className="w-5 h-5 text-white stroke-[3px]" />
                        ) : (
                          <RefreshCcw className="w-5 h-5 text-white stroke-[3px]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${tx.type === "receive" ? "text-green-500" : tx.type === "send" ? "text-red-500" : "text-blue-500"}`}>{tx.type === "receive" ? "+" : tx.type === "send" ? "-" : ""}{formatSuiAmount(tx.amount || 0)} SUI</p>
                        <p className="text-xs text-white/60">{tx.time}</p>
                        <div className="text-xs text-white/60 mt-1">
                          {tx.label === "Sui Storage Rebate" ? (
                            <div className="flex items-center gap-1.5 group/tooltip relative">
                              <span className="text-[#6FBEE5] font-bold cursor-help">♻️ {tx.label}</span>
                              <Info className="w-3.5 h-3.5 text-white/60" />

                              {/* Tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] p-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-xs text-white invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all z-50 pointer-events-none shadow-xl">
                                {TX_DESC_STORAGE_REBATE}
                                <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-black/80"></div>
                              </div>
                            </div>
                          ) : tx.label === "Smart Contract Interaction" ? (
                            <div className="flex items-center gap-1.5 group/tooltip relative">
                              <span className="text-purple-400 font-bold cursor-help">⚡ {tx.label}</span>
                              <Info className="w-3.5 h-3.5 text-white/60" />

                              {/* Tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] p-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-xs text-white invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all z-50 pointer-events-none shadow-xl">
                                {TX_DESC_CONTRACT_INTERACTION}
                                <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-black/80"></div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-0.5">
                              {tx.from && (
                                <div className="flex items-center text-white/80">
                                  <span className="mr-1">From:</span>
                                  <CopyAddress fullAddress={tx.from} displayAddress={truncateAddress(tx.from)} />
                                </div>
                              )}
                              {tx.to && (
                                <div className="flex items-center text-white/60">
                                  <span className="mr-1">To:</span>
                                  <CopyAddress fullAddress={tx.to} displayAddress={truncateAddress(tx.to)} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-white">{tx.usd}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Mindy AI */}
        <div className="xl:col-span-1">
          <Card className="border-white/20 backdrop-blur-xl bg-white/5 h-full overflow-hidden lg:h-[70vh]">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MindyAILogo className="w-15 h-15 text-[#6FBEE5]" />
                  <h3 className="text-3xl font-bold text-white">Mindy AI</h3>
                </div>
                {mindyMessages.length > 0 && (
                  <button
                    onClick={() => startMindySession({ forceNew: true })}
                    disabled={isMindyLoading}
                    className="p-2 rounded-full hover:bg-white/10 text-white/30 hover:text-red-400 transition-all disabled:opacity-50"
                    title="New Chat"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                )}
              </div>


              {/* Chat Messages Area */}
              <div className="flex-1 space-y-3 overflow-y-auto mb-4 min-h-[200px] scrollbar-thin scrollbar-thumb-white/10">
                {mindyMessages.length === 0 ? (
                  <>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <MindyAILogo className="w-8 h-8 text-[#6FBEE5]" />
                      </div>
                      <div className="bg-white/10 rounded-xl rounded-tl-none px-4 py-3 max-w-[85%]">
                        <p className="text-sm text-white/90">Hello! I&apos;m your AI financial assistant. How can I help you today?</p>
                      </div>
                    </div>

                    {/* Quick Prompts - Colorful & Interactive */}
                    <div className="flex flex-wrap gap-2.5 pt-5 pl-1 relative pb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                      <button
                        onClick={() => sendMindyMessage("Analyze my wallet")}
                        disabled={isMindyLoading}
                        className="group flex items-center gap-2 text-sm px-5 py-2.5 rounded-2xl bg-[#6FBEE5]/10 border border-[#6FBEE5]/20 text-[#6FBEE5] hover:bg-[#6FBEE5] hover:text-white transition-all font-bold -rotate-1 -translate-y-0.5 hover:rotate-0 hover:translate-y-0 shadow-lg shadow-[#6FBEE5]/10 hover:shadow-[#6FBEE5]/20 disabled:opacity-50"
                      >
                        <Wallet className="w-4 h-4" />
                        Analyze wallet
                      </button>
                      <button
                        onClick={() => sendMindyMessage("Find yield opportunities")}
                        disabled={isMindyLoading}
                        className="group flex items-center gap-2 text-sm px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-bold rotate-1 translate-y-0.5 hover:rotate-0 hover:translate-y-0 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:opacity-50"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Find yield
                      </button>
                      <button
                        onClick={() => sendMindyMessage("Check risks in my portfolio")}
                        disabled={isMindyLoading}
                        className="group flex items-center gap-2 text-sm px-5 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold -rotate-0.5 translate-x-0.5 hover:rotate-0 hover:translate-x-0 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Check risks
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {mindyMessages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`bg-transparent w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'mindy' ? 'bg-[#6FBEE5]/20 border-[#6FBEE5]/30' : 'bg-purple-500/20 border-purple-500/30'}`}>
                          {msg.role === 'mindy' ? <MindyAILogo className="w-8 h-8 text-[#6FBEE5]" /> : <Users className="w-4 h-4 text-purple-300" />}
                        </div>
                        <div className={`px-4 py-3 max-w-[85%] border shadow-lg ${msg.role === 'mindy'
                          ? 'bg-white/10 rounded-xl rounded-tl-none border-white/5 text-white/90'
                          : 'bg-purple-500/20 rounded-xl rounded-tr-none border-purple-500/10 text-white'
                          }`}>
                          <div className="text-sm leading-relaxed break-words">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ node: _node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                h1: ({ node: _node, ...props }) => <h1 className="text-2xl font-bold text-white mt-6 mb-4" {...props} />,
                                h2: ({ node: _node, ...props }) => <h2 className="text-xl font-bold text-white mt-5 mb-3" {...props} />,
                                h3: ({ node: _node, ...props }) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                                strong: ({ node: _node, ...props }) => <span className="font-bold text-white" {...props} />,
                                ul: ({ node: _node, ...props }) => <ul className="list-disc ml-4 mt-2 mb-2 space-y-1" {...props} />,
                                ol: ({ node: _node, ...props }) => <ol className="list-decimal ml-4 mt-2 mb-2 space-y-1" {...props} />,
                                li: ({ node: _node, ...props }) => <li {...props} />,
                                table: ({ node: _node, ...props }) => <div className="overflow-x-auto my-4"><table className="w-full border-collapse border border-white/20 text-sm" {...props} /></div>,
                                thead: ({ node: _node, ...props }) => <thead className="bg-white/10" {...props} />,
                                tbody: ({ node: _node, ...props }) => <tbody {...props} />,
                                tr: ({ node: _node, ...props }) => <tr className="border-b border-white/10 last:border-0" {...props} />,
                                th: ({ node: _node, ...props }) => <th className="px-4 py-2 text-left font-bold text-white border-r border-white/10 last:border-0" {...props} />,
                                td: ({ node: _node, ...props }) => <td className="px-4 py-2 text-white/80 border-r border-white/10 last:border-0" {...props} />,
                                a: ({ node: _node, ...props }) => <a className="text-[#6FBEE5] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                hr: ({ node: _node, ...props }) => <hr className="my-4 border-t border-white/60" {...props} /> // Subtle spacer line
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isMindyLoading && (
                      <div className="flex gap-2">
                        <div className="bg-transparent w-8 h-8 rounded-full bg-[#6FBEE5]/20 flex items-center justify-center flex-shrink-0">
                          <MindyAILogo className="w-8 h-8 text-[#6FBEE5]" />
                        </div>
                        <div className="bg-white/10 rounded-xl rounded-tl-none px-4 py-3 border border-white/5">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={mindyMessagesEndRef} />
                  </>
                )}
              </div>

              {/* Premium Chat Input - Matching Mindy Page */}
              <div className="mt-auto px-1 pb-1">
                <div className="max-w-4xl mx-auto w-full relative group">
                  {/* The Liquid Glowing Animated Border Wrap - Smoother Version */}
                  <div className="absolute -inset-[4px] bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] via-[#FF3DBC] via-[#00FFD1] via-[#FF3DBC] via-[#A890FE] to-[#6FBEE5] rounded-[2.2rem] sm:rounded-[3.7rem] opacity-40 blur-xl group-focus-within:opacity-70 transition-all duration-1000 animate-border-flow" />
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] via-[#FF3DBC] via-[#00FFD1] via-[#FF3DBC] via-[#A890FE] to-[#6FBEE5] rounded-[2.1rem] sm:rounded-[3.6rem] opacity-100 animate-border-flow" />

                  <div className="relative bg-[#050B15] backdrop-blur-3xl rounded-[2rem] sm:rounded-[3.5rem] py-3 px-4 sm:p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transition-all">
                    <div className="flex flex-col gap-3">
                      <textarea
                        value={mindyInput}
                        onChange={(e) => setMindyInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleMindySend()
                          }
                        }}
                        disabled={isMindyLoading}
                        placeholder="Ask Mindy AI anything..."
                        rows={1}
                        className="w-full bg-transparent text-white placeholder:text-white/20 focus:outline-none resize-none text-lg py-1 px-1 font-normal leading-relaxed scrollbar-none disabled:opacity-50"
                      />

                      <div className="flex items-center justify-end">
                        <button
                          onClick={handleMindySend}
                          disabled={isMindyLoading || !mindyInput.trim()}
                          className={`cursor-pointer w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isMindyLoading
                            ? "bg-white/10 scale-100 opacity-100 cursor-wait"
                            : mindyInput.trim()
                              ? "bg-gradient-to-r from-[#3B82F6] to-[#9333EA] opacity-100 scale-100 shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                              : "bg-white/5 opacity-0 scale-50 pointer-events-none"
                            }`}
                        >
                          {isMindyLoading ? (
                            <Square className="w-4 h-4 fill-current animate-pulse" />
                          ) : (
                            <ArrowUpRight className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card className="border-white/20 backdrop-blur-xl bg-white/5">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <MindyAILogo className="w-20 h-20 text-[#6FBEE5]" />
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-bold text-white">AI-Powered Suggestions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerateSuggestions}
                  disabled={isSuggestionsLoading}
                  className="text-[#6FBEE5] hover:text-[#5DAED5] hover:bg-[#6FBEE5]/10 gap-2 px-3 h-8 mt-1"
                >
                  <RefreshCcw className={`w-4 h-4 ${isSuggestionsLoading ? "animate-spin" : ""}`} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {isSuggestionsLoading ? "Generating Suggestions..." : "Regenerate"}
                  </span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestionsError ? (
                <div className="col-span-full p-6 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center text-center gap-3">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <X className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-medium">Failed to load suggestions</p>
                    <p className="text-white/50 text-sm">{suggestionsError}</p>
                  </div>
                  <Button
                    onClick={() => handleRegenerateSuggestions()}
                    className="mt-2 bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : isSuggestionsLoading ? (
                // Skeleton loading state
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-start gap-3 mb-3">
                      <Skeleton className="w-10 h-10 rounded-lg bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-32 bg-white/10" />
                          <Skeleton className="h-4 w-16 rounded-full bg-white/10" />
                        </div>
                        <Skeleton className="h-4 w-full bg-white/10" />
                        <Skeleton className="h-4 w-3/4 bg-white/10" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-full rounded-md bg-white/10" />
                  </div>
                ))
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-[#6FBEE5]/30 transition-all hover:shadow-lg hover:shadow-[#6FBEE5]/10"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{suggestion.title}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${suggestion.risk === "high"
                              ? "bg-red-500/20 text-red-400"
                              : suggestion.risk === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                              }`}
                          >
                            {suggestion.risk}
                          </span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed">{suggestion.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-[#6FBEE5] hover:text-[#5DAED5] hover:bg-[#6FBEE5]/10"
                      onClick={() => {
                        router.push(`/mindy-ai?prompt=${encodeURIComponent(`Tell me more about this suggestion:\n\nTitle: ${suggestion.title}\n\nRisk: ${suggestion.risk}\n\nDescription: ${suggestion.description}`)}`)
                      }}
                    >
                      Learn More @ Mindy AI
                    </Button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-white/40">No suggestions available right now.</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      {/* AI Insight Modal */}
      {insightModal.isOpen && (
        <div className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 transition-all duration-500 animate-in fade-in ${insightModal.isClosing ? "opacity-0 invisible" : "opacity-100 visible"}`}>
          <div className={`relative w-full max-w-lg group transition-all duration-500 ease-out animate-in fade-in zoom-in-95 ${insightModal.isClosing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"}`}>
            {/* Glowing Border Background */}
            <div className="absolute -inset-[3px] bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] to-[#FF3DBC] rounded-[34px] opacity-75 blur-lg group-hover:opacity-100 animate-border-flow transition-opacity duration-500" />

            <Card className="relative overflow-hidden bg-[#0A0A0B]/90 backdrop-blur-2xl border border-white/10 p-0 rounded-[32px] text-white w-full shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FBEE5] to-transparent shadow-[0_0_20px_rgba(111,190,229,0.5)]" />

              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                      <MindyAILogo className="w-10 h-10" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black tracking-tight">Mindy AI Insight</h2>
                        {/* Regenerate Button in Header */}
                        {!isInsightLoading && (
                          <button
                            onClick={handleRegenerateInsight}
                            className="p-1.5 rounded-lg text-white/50 hover:text-[#27C8F5] hover:bg-white/5 transition-all"
                            title="Regenerate Insight"
                          >
                            <RefreshCcw className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">By Mindy AI</p>
                    </div>
                  </div>
                  <button
                    onClick={insightModal.close}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-white/30 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 mb-8 min-h-[120px] flex items-center justify-center relative group/insight">
                  {/* Regenerate Button - Absolute Top Right */}

                  {isInsightLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-[#F527EB] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-[#27C8F5] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-[#4D27F5] rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-xs text-white font-bold uppercase tracking-widest animate-pulse">Analyzing Finances...</span>
                    </div>
                  ) : insightError ? (
                    <div className="flex flex-col items-center gap-3 py-2">
                      <p className="text-red-400 text-sm font-medium text-center">
                        {insightError || "Failed to generate insight"}
                      </p>
                      <Button
                        onClick={handleRegenerateInsight}
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-8 text-xs"
                      >
                        <RefreshCcw className="w-3 h-3 mr-2" />
                        Retry
                      </Button>
                    </div>
                  ) : insight ? (
                    <div className="text-white/80 leading-relaxed text-lg font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <ReactMarkdown
                        components={{
                          strong: ({ node: _node, ...props }) => <span className="text-[#6FBEE5] font-bold" {...props} />,
                          em: ({ node: _node, ...props }) => <span className="text-green-400 font-bold not-italic" {...props} />,
                          p: ({ node: _node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                        }}
                      >
                        {insight}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm">No insight available. Try regenerating.</p>
                  )}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#3B82F6] to-[#9333EA] hover:from-[#9333EA] hover:to-[#3B82F6] text-white py-6 rounded-xl font-black shadow-lg shadow-[#3B82F6]/20 border border-white/10 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    insightModal.close()
                    router.push(`/mindy-ai?prompt=${encodeURIComponent(`Tell me more about this financial insight:\n\n${insight}`)}`)
                  }}
                  disabled={isInsightLoading}
                >
                  Learn More @ Mindy AI
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Salary Edit Modal */}
      {salaryModal.isOpen && (
        <div className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 transition-all duration-500 animate-in fade-in ${salaryModal.isClosing ? "opacity-0 invisible" : "opacity-100 visible"}`}>
          <div className={`relative w-full max-w-xl group transition-all duration-500 ease-out animate-in fade-in zoom-in-95 ${salaryModal.isClosing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"}`}>
            {/* Glowing Border Background */}
            <div className="absolute -inset-[3px] bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] to-[#FF3DBC] rounded-[34px] opacity-75 blur-lg group-hover:opacity-100 animate-border-flow transition-opacity duration-500" />

            <Card className="relative overflow-hidden bg-[#0A0A0B]/90 backdrop-blur-2xl border border-white/10 p-0 rounded-[32px] text-white w-full shadow-2xl">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FBEE5] to-transparent shadow-[0_0_20px_rgba(111,190,229,0.5)]" />

              <div className="p-10 md:p-12">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                      <Pencil className="w-8 h-8 text-[#6FBEE5]" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">Edit Salary</h2>
                    </div>
                  </div>
                  <button
                    onClick={salaryModal.close}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-white/30 hover:text-white active:scale-90"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white uppercase tracking-widest ml-1">Active Income</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-[#6FBEE5]/5 rounded-xl blur-lg transition-opacity opacity-0 group-focus-within:opacity-100" />
                      <div className="relative flex items-center bg-[#141415] border border-white/5 rounded-2xl px-5 py-6 group-focus-within:border-[#6FBEE5]/50 transition-all">
                        <span className="text-2xl font-bold text-[#6FBEE5] mr-3">$</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={activeSalary}
                          onFocus={(e) => {
                            if (activeSalary === "0.00") setActiveSalary("");
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") setActiveSalary("0.00");
                          }}
                          onChange={(e) => setActiveSalary(e.target.value)}
                          className={`bg-transparent border-none text-2xl font-bold focus:outline-none w-full placeholder:text-white/10 ${activeSalary === "0.00" ? "text-white/30" : "text-white"}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white uppercase tracking-widest ml-1">Passive Income</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-[#6FBEE5]/5 rounded-xl blur-lg transition-opacity opacity-0 group-focus-within:opacity-100" />
                      <div className="relative flex items-center bg-[#141415] border border-white/5 rounded-2xl px-5 py-6 group-focus-within:border-[#6FBEE5]/50 transition-all">
                        <span className="text-2xl font-bold text-[#6FBEE5] mr-3">$</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={passiveSalary}
                          onFocus={(e) => {
                            if (passiveSalary === "0.00") setPassiveSalary("");
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") setPassiveSalary("0.00");
                          }}
                          onChange={(e) => setPassiveSalary(e.target.value)}
                          className={`bg-transparent border-none text-2xl font-bold focus:outline-none w-full placeholder:text-white/10 ${passiveSalary === "0.00" ? "text-white/30" : "text-white"}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5">
                  <div className="flex items-end justify-between mb-8 px-1">
                    <span className="text-white text-xs font-bold uppercase tracking-widest pb-1">Total Monthly</span>
                    <span className="text-3xl font-black text-white">
                      ${(Number(activeSalary) + Number(passiveSalary)).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="ghost"
                      className="py-6 rounded-xl border border-white/50 text-white/60 hover:text-white hover:bg-white/5 h-auto text-xs font-bold uppercase tracking-widest"
                      onClick={salaryModal.close}
                    >
                      Discard
                    </Button>
                    <Button
                      className="py-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#9333EA] hover:from-[#9333EA] hover:to-[#3B82F6] text-white font-black h-auto text-xs uppercase tracking-widest shadow-xl shadow-[#3B82F6]/20 border border-white/10"
                      onClick={() => {
                        setSalary((Number(activeSalary) + Number(passiveSalary)).toString())
                        salaryModal.close()
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Expenses Breakdown Modal */}
      {expensesModal.isOpen && (
        <div className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 transition-all duration-500 animate-in fade-in ${expensesModal.isClosing ? "opacity-0 invisible" : "opacity-100 visible"}`}>
          <div className={`relative w-full max-w-xl group transition-all duration-500 ease-out animate-in fade-in zoom-in-95 ${expensesModal.isClosing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"}`}>
            {/* Glowing Border Background */}
            <div className="absolute -inset-[3px] bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] to-[#FF3DBC] rounded-[34px] opacity-75 blur-lg group-hover:opacity-100 animate-border-flow transition-opacity duration-500" />

            <Card className="relative overflow-hidden bg-[#0A0A0B]/90 backdrop-blur-2xl border border-white/10 p-0 rounded-[32px] text-white w-full shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FBEE5] to-transparent shadow-[0_0_20px_rgba(111,190,229,0.5)]" />

              <div className="p-10 md:p-12">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                      <Eye className="w-8 h-8 text-[#6FBEE5]" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">Expenses</h2>
                    </div>
                  </div>
                  <button
                    onClick={expensesModal.close}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-white/30 hover:text-white active:scale-90"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                  {expenseCategories.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-6 rounded-[24px] bg-[#141415] border border-white/5 hover:border-[#6FBEE5]/30 hover:bg-white/[0.02] transition-all group">
                      <div className="flex items-center gap-6">
                        <p className="text-lg font-bold text-white group-hover:text-[#6FBEE5] transition-colors">{item.name}</p>
                      </div>
                      <span className="text-2xl font-black text-white tracking-tight">$ {Number(item.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-end justify-between mb-8 px-1">
                    <span className="text-white text-xs font-bold uppercase tracking-widest pb-1">Total Spending</span>
                    <span className="text-3xl font-black text-white">
                      ${expenseCategories.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}
                    </span>
                  </div>

                  <Button
                    className="w-full bg-white/5 hover:bg-white/10 text-white py-6 rounded-xl font-bold border border-white/5 shadow-xl h-auto text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
                    onClick={expensesModal.close}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}