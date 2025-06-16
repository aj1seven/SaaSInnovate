import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Tags, FileText, Download, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Analysis } from "@shared/schema";

interface AnalysisWithResults extends Analysis {
  results: {
    sentiment?: {
      overall: string;
      score: number;
      positive: number;
      neutral: number;
      negative: number;
      confidence: number;
    };
    keywords?: Array<{
      text: string;
      confidence: number;
      category?: string;
    }>;
    summary?: string;
    topics?: string[];
    error?: string;
  };
}

export function AnalysisResults() {
  const { data: analyses, isLoading } = useQuery<AnalysisWithResults[]>({
    queryKey: ["/api/analyses"],
  });

  const handleExport = async (analysisId: number, format: "json" | "csv" = "json") => {
    try {
      const response = await fetch(`/api/analyses/${analysisId}/export?format=${format}`, {
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analysis-${analysisId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Analysis Results</CardTitle>
          <p className="text-gray-600">Real-time AI analysis powered by OpenAI GPT-4o</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <p className="text-gray-700 mt-6 text-lg font-medium">Loading analysis results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedAnalyses = analyses?.filter(a => a.status === "completed" && a.results) || [];

  if (completedAnalyses.length === 0) {
    return (
      <Card className="shadow-xl border-0 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Analysis Results</CardTitle>
          <p className="text-gray-600">Your AI analysis results will appear here</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-700 text-xl font-semibold mb-2">No analysis results yet</p>
            <p className="text-gray-500 text-base">
              Start analyzing your content above to see detailed AI insights here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600">AI-powered insights from your content</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          {completedAnalyses.length} completed
        </Badge>
      </div>

      {completedAnalyses.map((analysis) => {
        const { results } = analysis;
        
        return (
          <Card key={analysis.id} className="shadow-xl border-0 overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Analysis #{analysis.id}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {getTimeAgo(analysis.createdAt)} • {analysis.content.slice(0, 60)}...
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(analysis.id)}
                  className="flex items-center space-x-2 hover:bg-blue-100"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment Analysis */}
                {results.sentiment && (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
                    </div>
                    
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {results.sentiment.overall}
                      </div>
                      <div className="text-sm text-gray-600">
                        Score: {results.sentiment.score.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Confidence: {(results.sentiment.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Positive</span>
                          <span className="text-sm font-semibold text-green-600">{results.sentiment.positive}%</span>
                        </div>
                        <Progress value={results.sentiment.positive} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Neutral</span>
                          <span className="text-sm font-semibold text-blue-600">{results.sentiment.neutral}%</span>
                        </div>
                        <Progress value={results.sentiment.neutral} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Negative</span>
                          <span className="text-sm font-semibold text-red-600">{results.sentiment.negative}%</span>
                        </div>
                        <Progress value={results.sentiment.negative} className="h-2" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {results.keywords && results.keywords.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Tags className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Keywords</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {results.keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 px-3 py-1"
                        >
                          {keyword.text}
                          <span className="ml-1 text-blue-600 font-semibold">
                            {(keyword.confidence * 100).toFixed(0)}%
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary and Topics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Summary */}
                {results.summary && (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">
                      {results.summary}
                    </p>
                  </div>
                )}

                {/* Topics */}
                {results.topics && results.topics.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-purple-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Topics</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {results.topics.map((topic, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100"
                        >
                          <span className="text-sm font-medium text-purple-800">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {results.error && (
                <div className="mt-6 bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Error</h3>
                  <p className="text-red-700">{results.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}