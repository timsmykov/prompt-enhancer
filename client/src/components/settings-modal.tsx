import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Save, X } from "lucide-react";
import type { Settings } from "@shared/schema";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [modelUrl, setModelUrl] = useState("https://api.example.com");
  const [autoEnhance, setAutoEnhance] = useState(false);
  const [saveHistory, setSaveHistory] = useState(true);
  
  const { toast } = useToast();

  // Fetch current settings
  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
    enabled: isOpen,
  });

  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      setApiKey(settings.apiKey || "");
      setModelUrl(settings.modelUrl || "https://api.example.com");
      setAutoEnhance(settings.autoEnhance || false);
      setSaveHistory(settings.saveHistory ?? true);
    }
  }, [settings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<Settings>) => {
      const response = await apiRequest("POST", "/api/settings", newSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully!",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveSettingsMutation.mutate({
      apiKey,
      modelUrl,
      autoEnhance,
      saveHistory,
    });
  };

  const handleReset = () => {
    setApiKey("");
    setModelUrl("https://api.example.com");
    setAutoEnhance(false);
    setSaveHistory(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Settings
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* API Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </Label>
                <Input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your API key will be stored locally and never shared.
                </p>
              </div>
              
              <div>
                <Label htmlFor="modelUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Model URL
                </Label>
                <Input
                  type="url"
                  id="modelUrl"
                  value={modelUrl}
                  onChange={(e) => setModelUrl(e.target.value)}
                  placeholder="https://api.example.com"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Enhancement Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enhancement Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Auto-enhance on paste</Label>
                  <p className="text-xs text-gray-500">Automatically enhance prompts when pasted</p>
                </div>
                <Switch
                  checked={autoEnhance}
                  onCheckedChange={setAutoEnhance}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Save enhancement history</Label>
                  <p className="text-xs text-gray-500">Keep a record of your recent enhancements</p>
                </div>
                <Switch
                  checked={saveHistory}
                  onCheckedChange={setSaveHistory}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Reset to Default
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveSettingsMutation.isPending}
            className="px-6 py-2 bg-primary text-white hover:bg-blue-600 font-medium"
          >
            <Save className="mr-2 h-4 w-4" />
            {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
