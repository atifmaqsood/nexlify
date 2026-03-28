"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Copy, Loader2, RotateCcw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters"),
  tone: z.string().min(1, "Please select a tone"),
  length: z.string().min(1, "Please select a length"),
  keywords: z.string().optional(),
});

interface AIToolFormProps {
  toolType: string;
  promptTemplate: string;
}

export function AIToolForm({ toolType, promptTemplate }: AIToolFormProps) {
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "professional",
      length: "medium",
      keywords: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setHasGenerated(true);
    setOutput("");
    
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({
          tool: toolType,
          inputs: values,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setOutput((prev) => prev + chunk);
        }
      }
      
      toast.success("Generation complete and saved to history!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const handleReset = () => {
    setOutput("");
    setHasGenerated(false);
    form.reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card className="bg-card border-border shadow-soft h-fit">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Configure {toolType}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-foreground italic px-1">Topic / Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Benefits of Remote Work" {...field} className="bg-muted/30 h-11 border-border font-medium" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-foreground italic px-1">Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/30 h-11 border-border font-medium">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="witty">Witty</SelectItem>
                          <SelectItem value="authoritative">Authoritative</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-foreground italic px-1">Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/30 h-11 border-border font-medium">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-foreground italic px-1">Keywords (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. productivity, saas, growth" {...field} className="bg-muted/30 h-11 border-border font-medium" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-11 font-bold italic tracking-wide"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Output Display */}
      <Card className="bg-card border-border shadow-soft flex flex-col min-h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
          <CardTitle className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/60 italic flex items-center gap-2">
            Output Results
            {!isGenerating && output && (
              <span className="flex items-center gap-1 text-success lowercase tracking-normal font-bold">
                <CheckCircle2 className="w-3 h-3" /> saved
              </span>
            )}
          </CardTitle>
          {hasGenerated && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {!hasGenerated ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20 grayscale">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-muted-foreground flex items-center justify-center mb-6 ring-8 ring-muted/50">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground uppercase tracking-widest italic">Awaiting Input</h3>
              <p className="text-xs text-muted-foreground max-w-[250px] font-medium leading-relaxed italic">
                Configure your request on the left and see the AI content appear here in real-time.
              </p>
            </div>
          ) : (
            <div className={cn(
              "whitespace-pre-wrap text-foreground leading-relaxed transition-opacity duration-500 font-medium",
              isGenerating ? "opacity-70" : "opacity-100"
            )}>
              {output || (isGenerating && <span className="text-primary italic font-bold">Initializing Gemini 1.5 engine...</span>)}
              {isGenerating && (
                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
