import { Header, MobileNav, Footer, AuthGuard } from "@/components/layout"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen">
            <div className="relative z-10 flex flex-col min-h-screen">
                <AuthGuard>
                    <Header />

                    {/* Main Content */}
                    <main className="flex-1 pt-[72px] pb-20 min-[1025px]:pb-0">
                        {children}
                    </main>

                    {/* Footer - hidden on mobile */}
                    <div className="hidden min-[1025px]:block">
                        <Footer />
                    </div>

                    {/* Mobile Bottom Navigation */}
                    <MobileNav />
                </AuthGuard>
            </div>
        </div>
    )
}