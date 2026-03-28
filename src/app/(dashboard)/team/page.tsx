"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  MoreHorizontal, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  Eye, 
  UserMinus,
  Mail
} from "lucide-react";
import { toast } from "sonner";

const members = [
  {
    id: "1",
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "Admin",
    joined: "Mar 12, 2026",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "2",
    name: "Jordan Smith",
    email: "jordan@example.com",
    role: "Member",
    joined: "Mar 15, 2026",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "3",
    name: "Casey Wilson",
    email: "casey@example.com",
    role: "Viewer",
    joined: "Mar 18, 2026",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
];

export default function TeamPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Invitation sent successfully!");
    setIsInviteOpen(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-primary/10 text-primary border-primary/20 gap-1"><ShieldCheck className="w-3 h-3" /> Admin</Badge>;
      case "Member":
        return <Badge className="bg-accent/10 text-accent border-accent/20 gap-1"><Shield className="w-3 h-3" /> Member</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><Eye className="w-3 h-3" /> Viewer</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Team Management</h2>
          <p className="text-muted-foreground">Manage your team members and their roles in this workspace.</p>
        </div>
        
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2">
              <UserPlus className="w-4 h-4" /> Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle>Invite new member</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter the email address of the person you want to invite to this workspace.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="name@example.com" className="pl-9 bg-muted/30" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select defaultValue="Member">
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">Send Invite</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-0 overflow-hidden bg-card border-border shadow-soft">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[300px]">Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="border-border hover:bg-muted/20 transition-colors group">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-border group-hover:scale-105 transition-transform">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-sm">{member.name}</span>
                      <span className="text-xs text-muted-foreground">{member.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(member.role)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{member.joined}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Shield className="w-4 h-4" /> Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive gap-2 cursor-pointer focus:text-destructive focus:bg-destructive/10">
                        <UserMinus className="w-4 h-4" /> Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      {/* Pending Invites */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Pending Invitations</h3>
        <div className="bg-muted/20 border border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-sm italic">No pending invitations at the moment.</p>
        </div>
      </div>
    </div>
  );
}
