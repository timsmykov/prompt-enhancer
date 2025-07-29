import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Copy, RotateCcw, ArrowLeft, Trash2, Settings, User, Lightbulb, Check } from "lucide-react";
import EnhancementModal from "./enhancement-modal";
import SettingsModal from "./settings-modal";
import type { Enhancement } from "@shared/schema";

interface EnhancementResponse {
  originalPrompt: string;
  enhancedPrompt: string;
  stats: {
    improvementRatio: string;
    wordsAdded: number;
    clarityScore: number;
  };
}

export default function PromptEnhancer() {
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [enhancementStats, setEnhancementStats] = useState<EnhancementResponse['stats']>({
    improvementRatio: "1.0",
    wordsAdded: 0,
    clarityScore: 0
  });
  
  const { toast } = useToast();

  // Fetch recent enhancements
  const { data: recentEnhancements = [] } = useQuery<Enhancement[]>({
    queryKey: ["/api/enhancements"],
  });

  // Enhancement mutation
  const enhanceMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/enhance", { prompt });
      return response.json() as Promise<EnhancementResponse>;
    },
    onSuccess: (data) => {
      setEnhancedPrompt(data.enhancedPrompt);
      setEnhancementStats(data.stats);
      queryClient.invalidateQueries({ queryKey: ["/api/enhancements"] });
      toast({
        title: "Prompt Enhanced",
        description: "Your prompt has been successfully enhanced!",
      });
    },
    onError: () => {
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance prompt. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEnhance = () => {
    if (!originalPrompt.trim()) {
      toast({
        title: "No Prompt",
        description: "Please enter a prompt to enhance.",
        variant: "destructive",
      });
      return;
    }
    enhanceMutation.mutate(originalPrompt);
  };

  const handleClear = () => {
    setOriginalPrompt("");
    setEnhancedPrompt("");
    setEnhancementStats({
      improvementRatio: "1.0",
      wordsAdded: 0,
      clarityScore: 0
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      toast({
        title: "Copied",
        description: "Enhanced prompt copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleInsert = () => {
    setOriginalPrompt(enhancedPrompt);
    toast({
      title: "Inserted",
      description: "Enhanced prompt inserted into input field!",
    });
  };

  const handleRegenerate = () => {
    enhanceMutation.mutate(originalPrompt);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wand2 className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Prompt Enhancer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="text-gray-600 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Original Prompt</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Enter your prompt below</span>
                  </div>
                </div>
                
                <div className="relative">
                  <Textarea
                    value={originalPrompt}
                    onChange={(e) => setOriginalPrompt(e.target.value)}
                    placeholder="Type your prompt here... For example: 'Write a blog post about AI'"
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-gray-400"
                  />
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">Characters: {originalPrompt.length}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        onClick={handleClear}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Clear
                      </Button>
                      <Button
                        onClick={handleEnhance}
                        disabled={enhanceMutation.isPending}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {enhanceMutation.isPending ? "Enhancing..." : "Enhance Prompt"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Prompt Results */}
            <Card className="mt-6 bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Enhanced Prompt</h2>
                  {enhancedPrompt && (
                    <Badge className="bg-success text-white">
                      <Check className="mr-1 h-3 w-3" />
                      Enhanced
                    </Badge>
                  )}
                </div>
                
                <div className="relative">
                  <Textarea
                    value={enhancedPrompt}
                    readOnly
                    className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-lg resize-none text-gray-800"
                    placeholder="Enhanced prompt will appear here..."
                  />
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">Characters: {enhancedPrompt.length}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        onClick={handleCopy}
                        disabled={!enhancedPrompt}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                      >
                        <Copy className="mr-1 h-4 w-4" />
                        Copy
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleRegenerate}
                        disabled={!originalPrompt || enhanceMutation.isPending}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                      <Button
                        onClick={handleInsert}
                        disabled={!enhancedPrompt}
                        className="px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Insert
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enhancement Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Improvement Ratio</span>
                    <span className="text-lg font-semibold text-primary">{enhancementStats.improvementRatio}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Words Added</span>
                    <span className="text-lg font-semibold text-success">{enhancementStats.wordsAdded}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Clarity Score</span>
                    <span className="text-lg font-semibold text-warning">{enhancementStats.clarityScore}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Enhancements */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Enhancements</h3>
                <div className="space-y-3">
                  {recentEnhancements.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No recent enhancements</p>
                  ) : (
                    recentEnhancements.map((enhancement) => (
                      <div key={enhancement.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">{enhancement.originalPrompt}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(enhancement.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  <Lightbulb className="mr-2 h-5 w-5 inline" />
                  Pro Tips
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <Check className="text-blue-600 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    Be specific about your desired outcome
                  </li>
                  <li className="flex items-start">
                    <Check className="text-blue-600 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    Include context and background information
                  </li>
                  <li className="flex items-start">
                    <Check className="text-blue-600 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    Specify the format you want for the response
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex justify-around items-center h-16">
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary">
            <span className="text-lg">✏️</span>
            <span className="text-xs">Input</span>
          </Button>
          <Button 
            onClick={handleEnhance}
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-primary"
          >
            <Wand2 className="h-5 w-5" />
            <span className="text-xs">Enhance</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary">
            <span className="text-lg">📜</span>
            <span className="text-xs">History</span>
          </Button>
          <Button 
            onClick={() => setShowSettings(true)}
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </nav>

      {/* Modals */}
      <EnhancementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        originalPrompt={originalPrompt}
        enhancedPrompt={enhancedPrompt}
        onInsert={handleInsert}
        onRegenerate={handleRegenerate}
      />
      
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
