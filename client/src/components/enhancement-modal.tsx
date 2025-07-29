import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, X } from "lucide-react";

interface EnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalPrompt: string;
  enhancedPrompt: string;
  onInsert: () => void;
  onRegenerate: () => void;
}

export default function EnhancementModal({
  isOpen,
  onClose,
  originalPrompt,
  enhancedPrompt,
  onInsert,
  onRegenerate,
}: EnhancementModalProps) {
  const handleInsert = () => {
    onInsert();
    onClose();
  };

  const handleRegenerate = () => {
    onRegenerate();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Enhanced Prompt Preview
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
        
        <div className="overflow-y-auto max-h-[60vh] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Original</h3>
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[120px]">
                {originalPrompt || "No original prompt"}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Enhanced</h3>
              <div className="p-4 bg-blue-50 rounded-lg text-sm text-gray-800 min-h-[120px]">
                {enhancedPrompt || "No enhanced prompt"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleRegenerate}
            className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <Button
            onClick={handleInsert}
            className="px-6 py-2 bg-primary text-white hover:bg-blue-600 font-medium"
          >
            <Check className="mr-2 h-4 w-4" />
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
