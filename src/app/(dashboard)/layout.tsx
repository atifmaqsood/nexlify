import { Sidebar, MobileNav } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar - Desktop */}
      <Sidebar className="hidden md:flex" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav />
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-[#0A0F1E]/50">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
