"use client"

import { Button, Card, Skeleton } from "@/components/ui"
import { processTx, mistToSui, formatSuiAmount } from "@/lib/utils"
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, ArrowDownLeft, Zap, Pencil, Eye, CheckCircle2,
  X, Repeat, ArrowDown, ArrowUp, Send, DownloadCloud, SendHorizontal,
  Plus, AtSign, Sparkles, Bot, Users, Square, Trash2, Bell, Scale, Minus
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useModal, useGetBalances, useGetDetailTransactions, useMindyAgent, usePaymentRequests } from "@/hooks"
import { useCurrentAccount, useSuiClientQuery, useSignTransaction } from "@mysten/dapp-kit"
import { SuiGraphQLClient } from '@mysten/sui/graphql'
import { graphql } from '@mysten/sui/graphql/schemas/latest'
import { Transaction } from '@mysten/sui/transactions'
import { toBase64 } from '@mysten/sui/utils'
import { MindyAILogo, SuiMindLogo } from "@/components/icons"
import ReactMarkdown from "react-markdown"


export default function HomePage() {
  const router = useRouter()
  const account = useCurrentAccount()

  // signTransaction
  const { mutateAsync: signTransaction } = useSignTransaction();
  const [isSending, setIsSending] = useState(false);
  const [showNewSendUI, setShowSendUI] = useState(false);
  const [showNewRequestUI, setShowRequestUI] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [requestRecipient, setRequestRecipient] = useState('');
  const [requestAmount, setRequestAmount] = useState('0.00');
  const [activeRequestObject, setActiveRequestObject] = useState<any>(null);
  const { pendingRequests, hasUnread, refetch, onTransactionSuccess } = usePaymentRequests();

  // setup GraphQLClient
  const gqlClient = new SuiGraphQLClient({
    url: 'https://graphql.testnet.sui.io/graphql', // Testnet
  });

  const EXECUTE_TRANSACTION = graphql(`
    mutation ExecuteTransaction($transactionDataBcs: Base64!, $signatures: [Base64!]!) {
      executeTransaction(transactionDataBcs: $transactionDataBcs, signatures: $signatures) {
        errors
        effects {
          status
          transaction {    # Digest lives here now
            digest
          }
        }
      }
    }
  `);

  const handleSend = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!recipient.startsWith('0x')) { alert("Please enter a valid Sui address."); return; }
    if (parseFloat(amount) <= 0) { alert("Please enter an amount greater than 0."); return; }


    setIsSending(true);
    let execution: any = null;

    try {
      const tx = new Transaction();
      const amountInMist = Math.floor(parseFloat(amount) * 1_000_000_000);
      const PACKAGE_ID = "0x5ae2ee3de630c587707ae71729e54e272cbab874a465ade2939ae8cf71d4c26d";

      const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
      tx.transferObjects([coin], recipient);
      tx.setSender(account.address);

      if (activeRequestObject) {
        tx.moveCall({
          target: `${PACKAGE_ID}::request::settle_payment_request`,
          arguments: [tx.object(activeRequestObject.id)],
        });
      }

      const { bytes, signature } = await signTransaction({ transaction: tx });

      const result = await gqlClient.query({
        query: EXECUTE_TRANSACTION,
        variables: {
          transactionDataBcs: bytes,
          signatures: [signature],
        },
      });

      execution = result.data?.executeTransaction;

      if (execution?.errors && execution.errors.length > 0) {
        alert(`Execution Error: ${execution.errors[0]}`);
        return;
      }

      const status = execution?.effects?.status;
      const digest = execution?.effects?.transaction?.digest;

      if (status === 'SUCCESS' || status?.status === 'success') {
        await onTransactionSuccess();
        setShowSendUI(false); 
        setAmount('0.00');    
        setRecipient('');
        setActiveRequestObject(null);
        refetch();
        alert(`Success! Digest: ${digest}`);
        
        
      } else {
        const detail = status?.error || "Check console for effects object";
        alert(`On-chain Failure: ${detail}`);
        console.log("Effects Details:", execution?.effects);
      }
    } catch (e: any) {
      console.error("System Error:", e);
      alert(`System Error: ${e.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleRequest = async () => {
    if (!account) return;
    if (!requestRecipient.startsWith('0x')) { alert("Invalid address"); return; }

    setIsSending(true);
    try {
      const tx = new Transaction();
      const PACKAGE_ID = "0x5ae2ee3de630c587707ae71729e54e272cbab874a465ade2939ae8cf71d4c26d";
      const MODULE_NAME = "request";
      const FUNCTION_NAME = "create_payment_request";
      const amountInMist = Math.floor(parseFloat(requestAmount) * 1_000_000_000);
      const expirationTimestamp = Date.now() + (24 * 60 * 60 * 1000);

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
        arguments: [
          tx.pure.address(requestRecipient),
          tx.pure.u64(amountInMist),
          tx.pure.string("REQ-ABCD-" + Date.now()),
          tx.pure.u64(expirationTimestamp),
        ],
      });


      const { bytes, signature } = await signTransaction({ transaction: tx });

      const result = await gqlClient.query({
        query: EXECUTE_TRANSACTION,
        variables: {
          transactionDataBcs: bytes,
          signatures: [signature],
        },
      });

      if (result.data?.executeTransaction?.effects?.status === 'SUCCESS') {
        alert("Request Object sent successfully!");
        setShowRequestUI(false);
        setRequestAmount('0.00');
        setRequestRecipient('');
      }
    } catch (e: any) {
      console.error("Request failed:", e);
      alert(`Error: ${e.message}`);
    } finally {
      setIsSending(false);
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
    const handleIncomingPaymentRequest = (event: any) => {
      const requestData = event.detail;

      setRecipient(requestData.requester);
      setAmount(requestData.amountSui.toString());
      setShowSendUI(true); 
    };
    window.addEventListener('PAY_REQUEST', handleIncomingPaymentRequest);

    return () => {
      window.removeEventListener('PAY_REQUEST', handleIncomingPaymentRequest);
    };
  }, []);

  useEffect(() => {
    const handleRejectRequest = async (event: any) => {
      const requestId = event.detail; // This is the ID passed from header.tsx [cite: 2]
      
      if (!account) {
        alert("Please connect your wallet first.");
        return;
      }

      setIsSending(true);
      try {
        const tx = new Transaction();
        const PACKAGE_ID = "0x5ae2ee3de630c587707ae71729e54e272cbab874a465ade2939ae8cf71d4c26d";

        tx.moveCall({
          target: `${PACKAGE_ID}::request::reject_request`,
          arguments: [tx.object(requestId)],
        });

        const { bytes, signature } = await signTransaction({ transaction: tx });

        const result = await gqlClient.query({
          query: EXECUTE_TRANSACTION,
          variables: {
            transactionDataBcs: bytes,
            signatures: [signature],
          },
        });

        const execution: any = result.data?.executeTransaction;
        const statusObj = execution?.effects?.status;

        const isSuccess = statusObj === 'SUCCESS' || statusObj?.status === 'success';

        if (isSuccess) {
          alert("Request rejected successfully.");
          refetch(); 
        } else {
          const detail = statusObj?.error || "Check console for details";
          alert(`Rejection failed: ${detail}`);
        }
      } catch (e: any) {
        console.error("Rejection Error:", e);
        alert(`System Error: ${e.message}`);
      } finally {
        setIsSending(false);
      }
    };

    window.addEventListener('REJECT_REQUEST', handleRejectRequest);
    return () => window.removeEventListener('REJECT_REQUEST', handleRejectRequest);
  }, [account, signTransaction, gqlClient, refetch]);
  


  const { data: balanceData, isLoading: isBalanceLoading } = useGetBalances()
  const { data: transactionData, isLoading: isTransactionLoading } = useGetDetailTransactions()

  // Convert MIST to SUI (1 SUI = 1,000,000,000 MIST)
  const walletBalance = balanceData?.totalBalance ? mistToSui(balanceData.totalBalance) : 0

  const recentTransactions = transactionData?.nodes
    ?.map((tx) => processTx(tx, account?.address))
    .filter((tx): tx is NonNullable<typeof tx> => tx !== null) || [];

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
  const insightModal = useModal()
  const salaryModal = useModal()
  const expensesModal = useModal()
  const [mindyInput, setMindyInput] = useState("")

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



  const [suggestions] = useState([
    {
      id: 1,
      title: "Optimize Your Savings",
      description: "You could save 15% more by reducing discretionary spending. Consider setting aside $500 monthly.",
      icon: "💰",
      priority: "high",
    },
    {
      id: 2,
      title: "Investment Opportunity",
      description: "Based on your surplus, investing in DeFi protocols could yield 8-12% APY on stablecoins.",
      icon: "📈",
      priority: "medium",
    },
    {
      id: 3,
      title: "Budget Alert",
      description: "Your expenses are trending upward. Review your spending categories to identify areas to optimize.",
      icon: "⚠️",
      priority: "medium",
    },
    {
      id: 4,
      title: "Emergency Fund",
      description: "Build an emergency fund of 3-6 months of expenses for financial security.",
      icon: "🛡️",
      priority: "low",
    },
  ])

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
                    `${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SUI`
                  )}
                </h2>
                {/* AI Insight beside the number */}
                <div
                  className="group relative overflow-hidden flex items-center justify-between px-8 py-5 rounded-[20px] bg-black/20 border border-white/10 cursor-pointer hover:border-[#6FBEE5]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(111,190,229,0.2)] self-start sm:self-center min-w-[340px] backdrop-blur-md"
                  onClick={insightModal.open}
                >
                  {/* Hover Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6FBEE5]/10 to-[#A890FE]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Left Side: Icon + Text */}
                  <div className="relative z-10 flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#6FBEE5]/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(111,190,229,0.3)]">
                        <MindyAILogo className="w-5 h-5 text-[#6FBEE5] fill-[#6FBEE5]" />
                      </div>
                      <h4 className="text-lg font-black text-white tracking-wide">AI Insight</h4>
                    </div>
                    <p className="text-sm font-medium text-white/50 group-hover:text-white/80 transition-colors pl-1">Tap for analysis</p>
                  </div>

                  {/* Right Side: Arrow Action */}
                  <div className="relative z-10 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-[#6FBEE5] group-hover:border-[#6FBEE5] transition-all duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Send & Request Buttons */}
            <div className="flex flex-row lg:flex-col gap-3">
              <Button
                onClick={() => setShowSendUI(true)} disabled={isSending || !account} className="flex-1 lg:flex-none lg:min-w-[170px] px-4 sm:px-6 py-5 sm:py-8 text-sm sm:text-base font-bold bg-[#6FBEE5]/30 hover:bg-[#6FBEE5]/20 text-white border border-[#6FBEE5] rounded-2xl transition-all duration-300 group relative flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#6FBEE5]/40 border border-[#6FBEE5] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#6FBEE5] transition-all duration-300 shrink-0">
                  <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-colors ml-0.5" />
                </div>
                <div className="flex flex-col center w-16 sm:w-20">
                  <span className="leading-none text-[#CCEEFF] group-hover:text-white transition-colors">Send</span>
                </div>
              </Button>
              <Button
                onClick={() => setShowRequestUI(true)} className="flex-1 lg:flex-none lg:min-w-[170px] px-4 sm:px-6 py-5 sm:py-8 text-sm sm:text-base font-bold bg-[#34D399]/30 hover:bg-[#34D399]/20 text-white border border-[#34D399] rounded-2xl transition-all duration-300 group relative flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#34D399]/40 border border-[#34D399] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#34D399] transition-all duration-300 shrink-0">
                  <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-colors" />
                </div>
                <div className="flex flex-col items-center w-16 sm:w-20">
                  <span className="leading-none text-[#CCFCDF] group-hover:text-white transition-colors">Request</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* After clicking send button*/}
      {showNewSendUI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSendUI(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Send SUI</h2>
            </div>

            {/* Available Balance */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Available Balance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {walletBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
                <span className="text-base font-normal text-gray-500">SUI</span>
              </p>
            </div>

            {/* Recipient Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 pr-24 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col">
                  <button
                    onClick={() => setAmount((prev) => (parseFloat(prev || '0') + 0.1).toFixed(2))}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setAmount((prev) => Math.max(0, parseFloat(prev || '0') - 0.1).toFixed(2))}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  SUI
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSendUI(false)}
                className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSending}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewRequestUI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRequestUI(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Request SUI</h2>
            </div>

            {/* Requested Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request From Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={requestRecipient}
                onChange={(e) => setRequestRecipient(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Request
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 pr-24 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col">
                  <button
                    onClick={() => setRequestAmount((prev) => (parseFloat(prev || '0') + 0.1).toFixed(2))}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setRequestAmount((prev) => Math.max(0, parseFloat(prev || '0') - 0.1).toFixed(2))}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  SUI
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRequestUI(false)}
                className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequest}
                disabled={isSending}
                className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      )}

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
              <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
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
                        {tx.type === "receive" ? (
                          <ArrowDownLeft className="w-5 h-5 text-white stroke-[3px]" />
                        ) : tx.type === "send" ? (
                          <ArrowUpRight className="w-5 h-5 text-white stroke-[3px]" />
                        ) : (
                          <Repeat className="w-5 h-5 text-white stroke-[3px]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${tx.type === "receive" ? "text-green-500" : tx.type === "send" ? "text-red-500" : "text-blue-500"}`}>{tx.type === "receive" ? "+" : tx.type === "send" ? "-" : ""}{formatSuiAmount(tx.amount)} SUI</p>
                        <p className="text-xs text-white/60">{tx.time}</p>
                        <p className="text-xs text-white/60 mt-1">
                          {tx.from && `From: ${tx.from}`}
                          {tx.to && `To: ${tx.to}`}
                        </p>
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
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MindyAILogo className="w-5 h-5 text-[#6FBEE5]" />
                  <h3 className="text-xl font-semibold" style={{ color: "white" }}>Mindy AI</h3>
                </div>
                {mindyMessages.length > 0 && (
                  <button
                    onClick={() => startMindySession({ forceNew: true })}
                    disabled={isMindyLoading}
                    className="p-2 rounded-full hover:bg-white/10 text-white/30 hover:text-red-400 transition-all disabled:opacity-50"
                    title="New Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>


              {/* Chat Messages Area */}
              <div className="flex-1 space-y-3 overflow-y-auto mb-4 min-h-[200px] scrollbar-thin scrollbar-thumb-white/10">
                {mindyMessages.length === 0 ? (
                  <>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#6FBEE5]/20 flex items-center justify-center flex-shrink-0">
                        <MindyAILogo className="w-4 h-4 text-[#6FBEE5]" />
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
                        <MindyAILogo className="w-4 h-4" />
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === 'mindy' ? 'bg-[#6FBEE5]/20 border-[#6FBEE5]/30' : 'bg-purple-500/20 border-purple-500/30'}`}>
                          {msg.role === 'mindy' ? <Bot className="w-4 h-4 text-[#6FBEE5]" /> : <Users className="w-4 h-4 text-purple-300" />}
                        </div>
                        <div className={`px-4 py-3 max-w-[85%] border shadow-lg ${msg.role === 'mindy'
                          ? 'bg-white/10 rounded-xl rounded-tl-none border-white/5 text-white/90'
                          : 'bg-purple-500/20 rounded-xl rounded-tr-none border-purple-500/10 text-white'
                          }`}>
                          <div className="text-sm leading-relaxed break-words">
                            <ReactMarkdown
                              components={{
                                p: ({ node: _node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                strong: ({ node: _node, ...props }) => <span className="font-bold text-white" {...props} />,
                                ul: ({ node: _node, ...props }) => <ul className="list-disc ml-4 mt-2 mb-2 space-y-1" {...props} />,
                                ol: ({ node: _node, ...props }) => <ol className="list-decimal ml-4 mt-2 mb-2 space-y-1" {...props} />,
                                li: ({ node: _node, ...props }) => <li {...props} />,
                                a: ({ node: _node, ...props }) => <a className="text-[#6FBEE5] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
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
                        <div className="w-8 h-8 rounded-full bg-[#6FBEE5]/20 flex items-center justify-center flex-shrink-0 border border-[#6FBEE5]/30">
                          <Bot className="w-4 h-4 text-[#6FBEE5]" />
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
              <MindyAILogo className="w-6 h-6 text-[#6FBEE5]" />
              <h3 className="text-xl font-semibold" style={{ color: "white" }}>AI-Powered Suggestions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion) => (
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
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${suggestion.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : suggestion.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                            }`}
                        >
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{suggestion.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-[#6FBEE5] hover:text-[#5DAED5] hover:bg-[#6FBEE5]/10"
                  >
                    Learn More
                  </Button>
                </div>
              ))}
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
                      <Zap className="w-6 h-6 text-[#6FBEE5]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">AI Insight</h2>
                      <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Smart Analysis</p>
                    </div>
                  </div>
                  <button
                    onClick={insightModal.close}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-white/30 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 mb-8">
                  <p className="text-white/80 leading-relaxed text-lg font-medium">
                    Based on your current cashflow, we suggest diversifying into <span className="text-[#6FBEE5] font-bold">Sui-native liquid staking protocols</span>. You could potentially increase your passive income by <span className="text-green-400 font-bold">8-12% annually</span>.
                  </p>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#3B82F6] to-[#9333EA] hover:from-[#9333EA] hover:to-[#3B82F6] text-white py-6 rounded-xl font-black shadow-lg shadow-[#3B82F6]/20 border border-white/10 uppercase tracking-widest text-xs"
                  onClick={insightModal.close}
                >
                  Action Plan
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
