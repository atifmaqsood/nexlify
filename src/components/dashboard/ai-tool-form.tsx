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
import { Sparkles, Copy, Save, Loader2, RotateCcw } from "lucide-react";
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
      
      toast.success("Generation complete!");
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

  const handleSave = async () => {
    // This will be implemented with Supabase later
    toast.success("Saved to history!");
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
                    <FormLabel>Topic / Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Benefits of Remote Work" {...field} className="bg-muted/30" />
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
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/30">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormLabel>Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/30">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                    <FormLabel>Keywords (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. productivity, saas, growth" {...field} className="bg-muted/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-11"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
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
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Output
          </CardTitle>
          {hasGenerated && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => { setOutput(""); setHasGenerated(false); }} className="h-8 w-8">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8 text-primary">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 p-6 overflow-y-auto">
          {!hasGenerated ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Ready to generate?</h3>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Fill out the form and click generate to see the magic happen.
              </p>
            </div>
          ) : (
            <div className={cn(
              "whitespace-pre-wrap text-foreground leading-relaxed transition-opacity duration-500",
              isGenerating ? "opacity-70" : "opacity-100"
            )}>
              {output || (isGenerating && "Initializing AI model...")}
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
