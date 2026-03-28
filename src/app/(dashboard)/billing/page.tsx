"use client";

import { 
  CreditCard, 
  Check, 
  Zap, 
  Users, 
  ArrowUpRight, 
  Download,
  ShieldCheck,
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { syncSubscription } from "@/app/actions/subscription";
import { getWorkspace } from "@/app/actions/workspace";

const invoices = [
  { id: "INV-001", date: "Mar 01, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-002", date: "Feb 01, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-003", date: "Jan 01, 2026", amount: "$29.00", status: "Paid" },
];

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>("FREE");

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const ws = await getWorkspace();
      setCurrentPlan(ws?.plan || "FREE");
    } catch (e) {
      setCurrentPlan("FREE");
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncSubscription();
      if (result.success) {
        toast.success(result.message);
        fetchPlan(); // Refresh UI
      } else {
        toast.info(result.message || result.error);
      }
    } catch (error) {
      toast.error("An error occurred during sync.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "PASTE_YOUR_PRICE_ID_IN_ENV_LOCAL";

      if (priceId === "PASTE_YOUR_PRICE_ID_IN_ENV_LOCAL") {
        toast.error("Stripe Price ID is missing! Add NEXT_PUBLIC_STRIPE_PRO_PRICE_ID to your .env.local");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          workspaceId: "default",
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("STRIPE_CHECKOUT_ERROR", error);
      toast.error(error.message || "Failed to initiate checkout. Check your Stripe keys.");
    } finally {
      setIsLoading(false);
    }
  };

  const isPro = currentPlan === "PRO";

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2 italic">Billing & Subscription</h2>
          <p className="text-muted-foreground font-medium italic">Manage your plan, usage limits, and payment methods.</p>
        </div>
        
        {/* Sync Button: Essential for Local Testing when webhooks are offline */}
        {!isPro && (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-primary/20 hover:bg-primary/5 text-primary font-bold italic"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw className={isSyncing ? "w-3.5 h-3.5 animate-spin" : "w-3.5 h-3.5"} />
            {isSyncing ? "Syncing..." : "Sync Status"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <Card className="lg:col-span-2 bg-card border-border shadow-soft overflow-hidden relative">
          <div className={`absolute top-0 left-0 w-1.5 h-full transition-all duration-500 ${isPro ? 'bg-success shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]'}`} />
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl font-bold flex items-center gap-2 italic tracking-tight">
                {isPro ? "Pro Plan" : "Free Trial"}
                <Badge className={isPro ? "bg-success/10 text-success border-success/20 uppercase text-[10px] font-extrabold tracking-widest px-2" : "bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-extrabold tracking-widest px-2"}>
                  {isPro ? "Active" : "Trialing"}
                </Badge>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm font-medium italic">
                {isPro 
                  ? "Your subscription is active! You have full access to all Nexlify features."
                  : "Start generating premium content with our Pro Plan."}
              </CardDescription>
            </div>
            <Zap className={`w-10 h-10 transition-colors ${isPro ? 'text-success/20' : 'text-primary/20'}`} />
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4">
              {/* Usage 1 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-bold italic">
                  <span className="flex items-center gap-2 text-foreground/80"><Check className="w-4 h-4 text-success" /> AI Generations</span>
                  <span className="text-foreground">1,284 / {isPro ? '5,000' : '10'}</span>
                </div>
                <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                  <div className={`absolute top-0 left-0 h-full transition-all duration-1000 shadow-lg ${isPro ? 'bg-success' : 'bg-primary'}`} style={{ width: isPro ? '25.6%' : '100%' }} />
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic opacity-70 text-right">
                  {isPro ? '25% of monthly limit used' : 'Trial limit reached'}
                </p>
              </div>

              {/* Usage 2 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-bold italic">
                  <span className="flex items-center gap-2 text-foreground/80"><Users className="w-4 h-4 text-accent" /> Team Seats</span>
                  <span className="text-foreground">3 / {isPro ? 'Unlimited' : '1'}</span>
                </div>
                <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                  <div className={`absolute top-0 left-0 h-full bg-accent transition-all duration-1000 shadow-lg`} style={{ width: isPro ? '30%' : '100%' }} />
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic opacity-70 text-right">
                  {isPro ? 'Active workspace' : 'Trial limit exceeded'}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t border-border/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider italic">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Secure payments powered by Stripe
            </div>
            <div className="flex items-center gap-3">
              {isPro ? (
                <Button variant="ghost" className="text-muted-foreground font-bold italic text-xs">Manage Subscription</Button>
              ) : (
                <>
                  <Button variant="ghost" className="text-muted-foreground font-bold italic text-xs">Explore Features</Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2 h-11 px-6 font-extrabold italic tracking-tight transition-all active:scale-95"
                    onClick={handleUpgrade}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        Upgrade to Pro <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Payment Method Card */}
        <Card className="bg-card border-border shadow-soft h-fit relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader>
            <CardTitle className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground italic">
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 relative z-10">
            {isPro ? (
              <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center shadow-md">
                  <CreditCard className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground italic">Visa ending in 4242</p>
                  <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest">Expires 12/28</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-border rounded-xl opacity-50 grayscale">
                <p className="text-xs font-bold italic text-muted-foreground">No payment method on file</p>
              </div>
            )}
            <Button variant="outline" className="w-full border-border hover:bg-muted font-bold italic h-12 text-sm shadow-sm" disabled={!isPro}>
              Update Card Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      {isPro && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground italic tracking-tight">Invoice History</h3>
          <Card className="p-0 overflow-hidden bg-card border-border shadow-soft">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic px-6">Invoice ID</TableHead>
                  <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic px-6">Date</TableHead>
                  <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic px-6">Amount</TableHead>
                  <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic px-6">Status</TableHead>
                  <TableHead className="text-right px-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-border hover:bg-muted/20 transition-all group">
                    <TableCell className="font-bold text-sm text-foreground italic px-6 py-5">{invoice.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-medium italic px-6">{invoice.date}</TableCell>
                    <TableCell className="text-sm text-foreground font-extrabold px-6">{invoice.amount}</TableCell>
                    <TableCell className="px-6">
                      <Badge variant="outline" className="bg-success/5 text-success border-success/20 font-extrabold text-[9px] uppercase tracking-widest px-2 py-0.5">
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <button className="h-9 w-9 text-muted-foreground hover:text-primary transition-all rounded-lg hover:bg-muted/50 inline-flex items-center justify-center">
                        <Download className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Warning Box */}
      {!isPro && (
        <div className="bg-warning/5 border border-warning/20 rounded-2xl p-6 flex items-start gap-4 shadow-sm animate-pulse">
          <div className="p-2 bg-warning/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-warning shrink-0" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-warning mb-1 uppercase tracking-widest italic">Free Tier Limits</h4>
            <p className="text-xs text-warning/80 leading-relaxed font-bold italic">
              Your current plan is near its usage limit for AI generations. Upgrade to Pro for 5,000+ generations and team collaboration.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
