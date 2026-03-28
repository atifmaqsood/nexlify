"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical, 
  Trash2, 
  Clock,
  CheckCircle2,
  Loader2,
  Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { getWorkspaceMembers, inviteMember } from "@/app/actions/workspace";
import { toast } from "sonner";

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const result = await getWorkspaceMembers();
      if (result.error) throw new Error(result.error);
      setMembers(result.data || []);
    } catch (error) {
      toast.error("Failed to load team members.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsInviting(true);
    try {
      const result = await inviteMember(inviteEmail);
      if (result.success) {
        toast.success(`Invitation sent to ${inviteEmail}`);
        setInviteEmail("");
        setIsDialogOpen(false);
        // We revalidate on server, but let's refresh locally for UX
        fetchMembers();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send invitation.");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Team Management</h2>
          <p className="text-muted-foreground">Manage your workspace members and invitations.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2 h-11 px-6">
              <UserPlus className="w-4 h-4" /> Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">Invite to Team</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Send an invitation email to add a new member to this workspace.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground italic px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="teammate@example.com" 
                    className="pl-10 h-11 bg-muted/50 border-border font-medium"
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="border-border hover:bg-muted font-bold"
              >
                Cancel
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 min-w-[120px]"
                onClick={handleInvite}
                disabled={isInviting}
              >
                {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isInviting ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card border-border shadow-soft overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Workspace Members</CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                  Currently active members in this workspace.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground italic font-medium">Loading your team...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center gap-4 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground opacity-30" />
                </div>
                <p className="text-sm text-muted-foreground italic font-medium">No members found besides you.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {members.map((member) => (
                  <div key={member.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-muted/10 transition-colors group">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 border border-border shadow-sm">
                        <AvatarImage src={`https://avatar.vercel.sh/${member.user_id}.png`} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {member.user_id.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            User {member.user_id.slice(-6)}
                          </p>
                          {member.role === 'admin' && (
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] uppercase font-bold px-1.5 py-0">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium italic">Active since {new Date(member.joined_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-success capitalize bg-success/10 px-2 py-0.5 rounded border border-success/20">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem className="text-xs font-bold gap-2 text-foreground">
                            <Shield className="w-3.5 h-3.5 text-primary" /> Edit Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold gap-2 text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-3.5 h-3.5" /> Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invitations Section (Future) */}
        <div className="bg-muted/20 border border-dashed border-border rounded-xl p-8 text-center">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h4 className="text-sm font-bold text-foreground mb-1 italic">Pending Invitations</h4>
          <p className="text-xs text-muted-foreground font-medium max-w-md mx-auto">
            You currently have no pending invitations. When you invite someone, they will appear here until they accept.
          </p>
        </div>
      </div>
    </div>
  );
}
