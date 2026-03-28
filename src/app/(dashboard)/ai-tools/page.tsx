import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIToolForm } from "@/components/dashboard/ai-tool-form";
import { 
  FileText, 
  Mail, 
  Share2, 
  ShoppingBag, 
  History 
} from "lucide-react";

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
          <div className="bg-card border border-border rounded-xl p-12 text-center opacity-50">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Generation History</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You haven't generated any content yet. Once you do, your history will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
