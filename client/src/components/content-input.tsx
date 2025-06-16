import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const analysisTypes = [
  { id: "sentiment", label: "Sentiment Analysis", defaultChecked: true },
  { id: "keywords", label: "Keyword Extraction", defaultChecked: true },
  { id: "summary", label: "Summary", defaultChecked: false },
  { id: "topics", label: "Topics", defaultChecked: false },
];

export function ContentInput() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["sentiment", "keywords"]);
  const [inputMethod, setInputMethod] = useState<"text" | "file" | "url">("text");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeContentMutation = useMutation({
    mutationFn: async (data: {
      content: string;
      contentType: string;
      analysisTypes: string[];
    }) => {
      const response = await apiRequest("POST", "/api/analyses", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Analysis Started",
        description: "Your content is being analyzed. Results will appear below.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });
      setContent("");
      setUrl("");
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    const analysisContent = inputMethod === "url" ? url : content;
    
    if (!analysisContent.trim()) {
      toast({
        title: "Content Required",
        description: "Please provide content to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTypes.length === 0) {
      toast({
        title: "Analysis Type Required",
        description: "Please select at least one analysis type.",
        variant: "destructive",
      });
      return;
    }

    analyzeContentMutation.mutate({
      content: analysisContent,
      contentType: inputMethod,
      analysisTypes: selectedTypes,
    });
  };

  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, typeId]);
    } else {
      setSelectedTypes(selectedTypes.filter(id => id !== typeId));
    }
  };

  return (
    <Card className="shadow-lg border-0 card-hover">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <CardTitle className="text-xl font-bold text-gray-900">Start New Analysis</CardTitle>
        <p className="text-gray-600 text-sm">Choose how you'd like to analyze your content with AI</p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-3">
            <Textarea
              placeholder="Paste your content here for AI analysis... 

Examples:
• Social media posts or comments
• Customer reviews or feedback
• Marketing copy or blog articles
• Research documents or reports
• Email content or communications"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-40 resize-none border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </TabsContent>
          
          <TabsContent value="file" className="space-y-3">
            <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                File upload functionality will be implemented in the file upload component
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-3">
            <Input
              placeholder="Enter URL to analyze..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Choose Analysis Types</h4>
          <div className="grid grid-cols-1 gap-3">
            {analysisTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <Checkbox
                  id={type.id}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleTypeChange(type.id, checked as boolean)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <label
                  htmlFor={type.id}
                  className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                >
                  {type.label}
                  <span className="block text-xs text-gray-500 mt-1">
                    {type.id === 'sentiment' && 'Determine emotional tone and feelings'}
                    {type.id === 'keywords' && 'Extract important terms and phrases'}
                    {type.id === 'summary' && 'Generate concise content overview'}
                    {type.id === 'topics' && 'Identify main themes and subjects'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={analyzeContentMutation.isPending}
          className="w-full btn-primary text-lg py-4"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {analyzeContentMutation.isPending ? "AI is analyzing your content..." : "Start AI Analysis"}
        </Button>
      </CardContent>
    </Card>
  );
}
