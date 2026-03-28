"use client";

import { 
  CreditCard, 
  Check, 
  Zap, 
  Users, 
  ArrowUpRight, 
  Download,
  ShieldCheck,
  AlertCircle
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

const invoices = [
  { id: "INV-001", date: "Mar 01, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-002", date: "Feb 01, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-003", date: "Jan 01, 2026", amount: "$29.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Billing & Subscription</h2>
        <p className="text-muted-foreground">Manage your plan, usage limits, and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <Card className="lg:col-span-2 bg-card border-border shadow-soft overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Pro Plan
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-bold">Active</Badge>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Your next renewal is on **April 01, 2026** for **$29.00/month**.
              </CardDescription>
            </div>
            <Zap className="w-8 h-8 text-primary/20" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              {/* Usage 1 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> AI Generations</span>
                  <span className="text-foreground">1,284 / 5,000</span>
                </div>
                <Progress value={25} className="h-2 bg-muted transition-all duration-1000" />
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">25% of monthly limit used</p>
              </div>

              {/* Usage 2 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2"><Users className="w-4 h-4 text-accent" /> Team Seats</span>
                  <span className="text-foreground">3 / 5</span>
                </div>
                <Progress value={60} className="h-2 bg-muted" />
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">60% of seat limit used</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Secure payments powered by Stripe
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-destructive hover:bg-destructive/10">Cancel Subscription</Button>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2">
                Upgrade Plan <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Payment Method Card */}
        <Card className="bg-card border-border shadow-soft h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
              <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground font-medium uppercase">Expires 12/28</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-border hover:bg-muted font-bold h-11">
              Update Card Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Invoice History</h3>
        <Card className="p-0 overflow-hidden bg-card border-border shadow-soft">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-border hover:bg-muted/20 transition-colors group">
                  <TableCell className="font-bold text-sm text-foreground">{invoice.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{invoice.date}</TableCell>
                  <TableCell className="text-sm text-foreground font-medium">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 font-bold text-[10px]">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Warning Box */}
      <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-warning shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-warning mb-1">Low Balance Alert</h4>
          <p className="text-xs text-warning/80 leading-relaxed font-medium">
            Your current plan is near its usage limit for AI generations. To avoid interruptions, consider upgrading to the Pro plan.
          </p>
        </div>
      </div>
    </div>
  );
}
