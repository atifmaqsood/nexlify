"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Rocket, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Users,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { acceptInvitation } from "@/app/actions/workspace";
import { toast } from "sonner";
import Link from "next/link";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = params.token as string;

  const handleJoin = async () => {
    setIsJoining(true);
    setError(null);
    try {
      const result = await acceptInvitation(token);
      if (result.success) {
        toast.success("Successfully joined the workspace!");
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to join workspace.");
        toast.error(result.error || "Failed to join workspace.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x" />
        
        <CardHeader className="text-center pb-8 pt-10">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">You've been invited!</CardTitle>
          <CardDescription className="text-muted-foreground font-medium pt-2">
            A teammate has invited you to collaborate on their **Nexlify** workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pb-10">
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Share AI generations and strategy" },
              { icon: CheckCircle2, text: "Collaborate on blog posts & emails" },
              { icon: Rocket, text: "Scale your content production together" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-foreground p-3 rounded-lg bg-muted/30 border border-border/50">
                <feature.icon className="w-4 h-4 text-primary" />
                {feature.text}
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-xs text-destructive font-bold">{error}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-10">
          <Button 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20 gap-2"
            onClick={handleJoin}
            disabled={isJoining}
          >
            {isJoining ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Accept Invitation <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
          
          <Link href="/dashboard" className="w-full">
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground font-bold">
              Maybe later
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
