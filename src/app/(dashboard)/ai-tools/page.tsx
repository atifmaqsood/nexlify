"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIToolForm } from "@/components/dashboard/ai-tool-form";
import { 
  FileText, 
  Mail, 
  Share2, 
  ShoppingBag, 
  History,
  Trash2,
  Clock,
  Loader2,
  Maximize2,
  Copy,
  Check
} from "lucide-react";
import { getAIHistory, deleteAIGeneration } from "@/app/actions/ai";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";

const tools = [
  {
    id: "blog",
    name: "Blog Post Writer",
    icon: FileText,
    prompt: "Generate a comprehensive blog post about...",
  },
  {
    id: "email",
    name: "Email Copywriter",
    icon: Mail,
    prompt: "Write a professional email for...",
  },
  {
    id: "social",
    name: "Social Media",
    icon: Share2,
    prompt: "Generate engaging social media captions for...",
  },
  {
    id: "product",
    name: "Product Description",
    icon: ShoppingBag,
    prompt: "Write a compelling product description for...",
  },
];

export default function AIToolsPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<any>(null);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const result = await getAIHistory();
      if (result.error) throw new Error(result.error);
      setHistory(result.data || []);
    } catch (error) {
      console.error("HISTORY_FETCH_ERROR", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteAIGeneration(id);
      if (result.error) throw new Error(result.error);
      setHistory(history.filter(h => h.id !== id));
      toast.success("Generation deleted!");
    } catch (error) {
      toast.error("Failed to delete generation.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">AI Tools</h2>
        <p className="text-muted-foreground">Select a tool and start generating high-quality AI content.</p>
      </div>

      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="bg-muted/50 p-1 border border-border h-12 gap-2 mb-8">
          {tools.map((tool) => (
            <TabsTrigger 
              key={tool.id} 
              value={tool.id}
              className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white gap-2"
            >
              <tool.icon className="w-4 h-4" />
              {tool.name}
            </TabsTrigger>
          ))}
          <TabsTrigger 
            value="history"
            onClick={fetchHistory}
            className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white gap-2"
          >
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        {tools.map((tool) => (
          <TabsContent key={tool.id} value={tool.id} className="mt-0">
            <AIToolForm toolType={tool.name} promptTemplate={tool.prompt} />
          </TabsContent>
        ))}

        <TabsContent value="history" className="mt-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <span className="relative flex h-8 w-8">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                <Loader2 className="relative w-8 h-8 text-primary animate-spin" />
              </span>
              <p className="text-sm text-muted-foreground animate-pulse">Loading your history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center opacity-50">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Generation History</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You haven't generated any content yet. Once you do, your history will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <Card key={item.id} className="bg-card border-border shadow-soft group hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] uppercase font-bold px-2 py-0">
                          {item.tool_type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium italic">
                          <Clock className="w-3 h-3" /> 
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DialogTrigger className="h-7 w-7 text-muted-foreground hover:text-primary rounded-md inline-flex items-center justify-center transition-colors">
                          <Maximize2 className="w-4 h-4" />
                        </DialogTrigger>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-1 line-clamp-1">{item.prompt}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {item.output}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Full Content Dialog */}
      <Dialog open={!!selectedGeneration} onOpenChange={() => setSelectedGeneration(null)}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border p-0 overflow-hidden shadow-2xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
          <div className="p-6 space-y-6">
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary hover:bg-primary/90 text-white font-bold border-none">
                  {selectedGeneration?.tool_type}
                </Badge>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium italic">
                    <Clock className="w-3 h-3" /> 
                    {selectedGeneration && new Date(selectedGeneration.created_at).toLocaleString()}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2 bg-muted/50 border-border hover:bg-muted text-foreground"
                    onClick={() => copyToClipboard(selectedGeneration?.output)}
                  >
                    {hasCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {hasCopied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
              <DialogTitle className="text-xl font-bold text-foreground leading-tight">
                {selectedGeneration?.prompt}
              </DialogTitle>
            </DialogHeader>

            <div className="bg-muted/30 rounded-xl p-5 border border-border/50 max-h-[400px] overflow-y-auto custom-scrollbar">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedGeneration?.output}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
