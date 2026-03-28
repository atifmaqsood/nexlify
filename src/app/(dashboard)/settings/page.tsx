"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  User as UserIcon, 
  Building, 
  Key, 
  Bell, 
  Trash2, 
  ShieldAlert,
  Copy,
  RefreshCw,
  Plus,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@clerk/nextjs";
import { getWorkspace, updateWorkspace } from "@/app/actions/workspace";
import { seedOrganicData } from "@/app/actions/seed";
import { Database, Sparkles as SparkleIcon } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const [workspace, setWorkspace] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.fullName || "");
    }
    fetchWorkspace();
  }, [user]);

  const fetchWorkspace = async () => {
    try {
      const ws = await getWorkspace();
      setWorkspace(ws);
      setWorkspaceName(ws?.name || "");
      setWorkspaceSlug(ws?.slug || "");
    } catch (e) {
      console.error("LOAD_WS_ERROR", e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    try {
      const nameParts = displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      await user.update({
        firstName,
        lastName,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const result = await updateWorkspace(workspaceName, workspaceSlug);
      if (result.success) {
        toast.success("Workspace settings saved!");
        fetchWorkspace();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save workspace settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedData = async () => {
    setIsSaving(true);
    try {
      const result = await seedOrganicData();
      if (result.success) {
        toast.success(result.message || "Data seeded successfully!");
        fetchWorkspace();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to seed demo data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your personal profile and workspace configurations.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-muted/50 p-1 border border-border h-12 gap-2 mb-8">
          <TabsTrigger value="profile" className="gap-2 font-bold"><UserIcon className="w-4 h-4" /> Profile</TabsTrigger>
          <TabsTrigger value="workspace" className="gap-2 font-bold"><Building className="w-4 h-4" /> Workspace</TabsTrigger>
          <TabsTrigger value="api" className="gap-2 font-bold"><Key className="w-4 h-4" /> API Keys</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 font-bold"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-0 space-y-6">
          <Card className="bg-card border-border shadow-soft">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and how others see you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-border/50">
                <Avatar className="w-20 h-20 border-2 border-primary/20 ring-1 ring-primary/10">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName?.slice(0, 1) || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="border-border hover:bg-muted font-bold">Change Avatar</Button>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider italic">JPG, GIF or PNG. 1MB Max.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground italic px-1">Display Name</label>
                  <Input 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-muted/30 border-border font-medium h-11" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground italic px-1">Email Address</label>
                  <Input value={user?.emailAddresses[0]?.emailAddress || ""} disabled className="bg-muted/10 border-border opacity-60 font-medium h-11" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border p-6 flex justify-end">
              <Button 
                onClick={handleSaveProfile} 
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold px-8"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Workspace Settings */}
        <TabsContent value="workspace" className="mt-0 space-y-6">
          <Card className="bg-card border-border shadow-soft">
            <CardHeader>
              <CardTitle>Workspace Configuration</CardTitle>
              <CardDescription>Customize your workspace identity and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground italic px-1">Workspace Name</label>
                  <Input 
                    value={workspaceName} 
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="bg-muted/30 border-border font-medium h-11" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground italic px-1">Workspace Slug</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold italic">launchdesk.ai/</span>
                    <Input 
                      value={workspaceSlug} 
                      onChange={(e) => setWorkspaceSlug(e.target.value)}
                      className="bg-muted/30 border-border pl-24 font-medium h-11" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border p-6 flex justify-end">
              <Button 
                onClick={handleSaveWorkspace} 
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold px-8"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Workspace
              </Button>
            </CardFooter>
          </Card>

          {/* Presentation Mode Seeding */}
          <Card className="bg-card border-primary/20 bg-primary/5 overflow-hidden shadow-soft">
            <CardHeader className="bg-primary/10 border-b border-primary/20">
              <CardTitle className="text-primary flex items-center gap-2 font-bold italic">
                <Database className="w-5 h-5" /> Client Presentation Mode
              </CardTitle>
              <CardDescription className="text-primary/80 font-medium italic">Instantly populate your workspace with professional organic data for demos.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground mb-1 uppercase text-xs tracking-wider flex items-center gap-2">
                    <SparkleIcon className="w-3.5 h-3.5 text-primary" /> Seed Mock Data
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-sm font-medium italic leading-relaxed">
                    This will add 7 days of realistic AI history, mock team members, and high-quality content examples to your dashboard. Perfect for showing clients how the app looks when active.
                  </p>
                </div>
                <Button 
                  onClick={handleSeedData} 
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold h-11 px-6 min-w-[200px]"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                  Seed Demo Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30 bg-destructive/5 overflow-hidden">
            <CardHeader className="bg-destructive/10 border-b border-destructive/20">
              <CardTitle className="text-destructive flex items-center gap-2 font-bold">
                <ShieldAlert className="w-5 h-5" /> Danger Zone
              </CardTitle>
              <CardDescription className="text-destructive/80 font-medium">Permanent actions that cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-foreground mb-1 uppercase text-xs tracking-wider">Delete Workspace</h4>
                  <p className="text-xs text-muted-foreground max-w-sm font-medium italic">
                    Deleting your workspace will permanently remove all data, team members, and AI generations associated with it.
                  </p>
                </div>
                <Button variant="destructive" className="shadow-lg shadow-destructive/20 font-bold h-11 px-6">
                  Delete Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys (Limited Mock with logic) */}
        <TabsContent value="api" className="mt-0 space-y-6">
          <Card className="bg-card border-border shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle>API Management</CardTitle>
                <CardDescription>Integrate LaunchDesk with your external applications.</CardDescription>
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2 h-10 px-4 font-bold">
                <Plus className="w-4 h-4" /> Create Key
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-bold text-xs">KEY NAME</TableHead>
                    <TableHead className="font-bold text-xs">VALUE</TableHead>
                    <TableHead className="font-bold text-xs text-center">STATUS</TableHead>
                    <TableHead className="text-right font-bold text-xs">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border hover:bg-muted/20 transition-colors">
                    <TableCell className="font-bold text-sm text-foreground">Production Key</TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-xs text-primary font-mono select-all">
                        ld_live_••••••••••••••••
                      </code>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-success/10 text-success border-success/20 font-bold text-[10px]">ACTIVE</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => toast.success("Key copied!")}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 space-y-6">
          <Card className="bg-card border-border shadow-soft">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage how we communicate with you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: "AI Usage Alerts", desc: "Notify me when I reach 80% of my generation limit." },
                { title: "Team Invites", desc: "Notify me when a new member joins the workspace." },
                { title: "Billing & Invoices", desc: "Notify me of successful payments and new invoices." },
                { title: "Product Updates", desc: "Keep me in the loop with new features and improvements." },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0 group">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-xs text-muted-foreground font-medium italic">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={index < 3} onCheckedChange={() => toast.success("Settings updated.")} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
