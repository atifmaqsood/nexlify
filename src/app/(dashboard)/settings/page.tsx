"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building, 
  Key, 
  Bell, 
  Trash2, 
  ShieldAlert,
  Copy,
  RefreshCw,
  Plus,
  Rocket
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
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const [apiKey, setApiKey] = useState("ld_live_4k83m20f9s1l8p39z");
  const [isSaving, setIsSaving] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard!");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // In Clerk, we update the user object. 
      // For this demo, we'll just simulate a profile update toast.
      await new Promise(resolve => setTimeout(resolve, 800));
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
      // Here we would normally update the 'workspaces' table in Supabase
      // Update code: await supabase.from('workspaces').update({ name, slug }).eq('id', workspaceId)
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Workspace settings saved!");
    } catch (error) {
      toast.error("Failed to save workspace settings.");
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
          <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Profile</TabsTrigger>
          <TabsTrigger value="workspace" className="gap-2"><Building className="w-4 h-4" /> Workspace</TabsTrigger>
          <TabsTrigger value="api" className="gap-2"><Key className="w-4 h-4" /> API Keys</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
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
                <Avatar className="w-20 h-20 border-2 border-primary/20">
                  <AvatarImage src="https://i.pravatar.cc/150?u=me" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="border-border hover:bg-muted font-bold">Change Avatar</Button>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">JPG, GIF or PNG. 1MB Max.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input defaultValue="Admin User" className="bg-muted/30 border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input defaultValue="admin@launchdesk.ai" disabled className="bg-muted/10 border-border opacity-60" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border p-6 flex justify-end">
              <Button 
                onClick={handleSaveProfile} 
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
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
                  <label className="text-sm font-medium">Workspace Name</label>
                  <Input defaultValue="My Workspace" className="bg-muted/30 border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workspace Slug</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium">launchdesk.ai/</span>
                    <Input defaultValue="my-workspace" className="bg-muted/30 border-border pl-24" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border p-6 flex justify-end">
              <Button 
                onClick={handleSaveWorkspace} 
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Workspace
              </Button>
            </CardFooter>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30 bg-destructive/5 overflow-hidden">
            <CardHeader className="bg-destructive/10 border-b border-destructive/20">
              <CardTitle className="text-destructive flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Danger Zone
              </CardTitle>
              <CardDescription className="text-destructive/80">Permanent actions that cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-foreground mb-1">Delete Workspace</h4>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Deleting your workspace will permanently remove all data, team members, and AI generations associated with it.
                  </p>
                </div>
                <Button variant="destructive" className="shadow-lg shadow-destructive/20 font-bold">
                  Delete Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="mt-0 space-y-6">
          <Card className="bg-card border-border shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle>API Management</CardTitle>
                <CardDescription>Integrate LaunchDesk with your external applications.</CardDescription>
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2">
                <Plus className="w-4 h-4" /> Create Key
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Key Name</TableHead>
                    <TableHead>Key Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border hover:bg-muted/20 transition-colors">
                    <TableCell className="font-bold text-sm text-foreground">Production Key</TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-xs text-primary font-mono select-all">
                        {apiKey.slice(0, 8)}••••••••••••
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success border-success/20 font-bold text-[10px]">ACTIVE</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={copyApiKey} className="h-8 w-8 text-muted-foreground hover:text-foreground">
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

        {/* Notifications */}
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
                <div key={index} className="flex items-center justify-between gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={index < 3} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
