import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  promptTemplates,
  quickSuggestions,
  promptCategories,
  getCustomizedPrompt,
  languageOptions
} from '@/features/ai-assitant/utils/promt-templates';
import { callGeminiAPI } from '@/features/ai-assitant/utils/call-genini-ai';
import {
  CategoryButton,
  QuickSuggestionCard,
  PromptTemplateCard,
  GenerateButton,
  LanguageSelector,
  TextArea,
  SelectedTextPreview,
} from './ai-components';

import { Sparkles, Copy, ArrowRightCircle} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  documentContext: string;
  insertContent: (content: string) => void;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  selectedText,
  documentContext,
  insertContent,
}) => {
  // State management
  const [userDescription, setUserDescription] = useState<string>('');
  const [aiResponse, setAIResponse] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAIInserted, setIsAIInserted] = useState<boolean>(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Spanish');
  const [focusKeyword, setFocusKeyword] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('suggest');
  const [activePromptCategory, setActivePromptCategory] = useState<string>('refinement');
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Refs
  const responseRef = useRef<HTMLDivElement>(null);

  // Determine if we have a valid API key
  const hasValidApiKey = Boolean(geminiApiKey);

  // Scroll to response when it's generated
  useEffect(() => {
    if (aiResponse && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResponse]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setUserDescription('');
      setAIResponse('');
      setIsAIInserted(false);
      setShowAdvancedOptions(false);
      setSelectedLanguage('Spanish');
      setFocusKeyword('');
      setActiveTab('suggest');
      setActivePromptCategory('refinement');
    }
  }, [isOpen]);

  // Handle template selection
  const handleTemplateSelection = (templateKey: string) => {
    // Special handling for translate template
    if (templateKey === 'translate') {
      setShowAdvancedOptions(true);
    }
  };

  // Handle quick suggestion click
  const handleQuickSuggestion = async (templateKey: string): Promise<void> => {
    setIsGenerating(true);
    setAIResponse(''); // Clear previous responses

    try {
      // Get the customized prompt
      const prompt = getCustomizedPrompt(templateKey, {
        language: selectedLanguage,
        keyword: focusKeyword
      });

      // Add user description if provided
      const enhancedPrompt = userDescription.trim()
        ? `${prompt}\n\nAdditional user instructions: ${userDescription}`
        : prompt;

      // Call the API
      const response = await callGeminiAPI(
        geminiApiKey,
        selectedText,
        documentContext,
        enhancedPrompt,
      );

      setAIResponse(response);
    } catch (error) {
      console.error('Error generating content:', error);
      setAIResponse('Error: Failed to generate response. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle AI prompt submission with custom description
  const handleSubmitUserDescription = async (): Promise<void> => {
    if (!userDescription.trim()) return;
    await handleQuickSuggestion('expand');
  };

  // Insert AI response into editor
  const handleInsertAIResponse = (): void => {
    if (aiResponse) {
      insertContent(aiResponse);
      setIsAIInserted(true);
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  // Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitUserDescription();
    }
  };

  // Function to copy AI response to clipboard
  const handleCopyResponse = (): void => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
      // Use a toast notification instead of alert in a real application
      alert('Copied to clipboard!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden p-2">
        <DialogHeader className="px-4">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl flex items-center">
              <Sparkles className="mr-2 h-5 w-5" /> 
              Trợ lý viết AI
            </DialogTitle>
            
          </div>
          <DialogDescription>
            Sử dụng AI để hỗ trợ viết nội dung cho bài đăng của bạn
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="suggest"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b border-gray-200">
            <TabsList className="mx-6 h-12 bg-transparent">
              <TabsTrigger 
                value="suggest"
              >
                <span className="mr-2">⚡</span> Để xuất nhanh 
              </TabsTrigger>
              <TabsTrigger 
                value="custom"
              >
                <span className="mr-2">🔍</span> Tuỳ chỉnh
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="p-6 max-h-[60vh]">
            {/* Selected Text Preview */}
            {selectedText && <SelectedTextPreview text={selectedText} />}

            <TabsContent value="suggest" className="mt-0 border-0 p-0">
              {/* Quick Suggestion Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                {quickSuggestions.map((suggestion) => (
                  <QuickSuggestionCard
                    key={suggestion.key}
                    suggestion={suggestion}
                    onClick={() => handleQuickSuggestion(suggestion.key)}
                    disabled={isGenerating || (!selectedText && !documentContext.trim())}
                  />
                ))}
              </div>

              {/* User Description Input */}
              <TextArea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Mô tả những gì bạn muốn AI làm với văn bản của bạn..."
                disabled={isGenerating}
                rows={3}
                label="Hướng dẫn tùy chỉnh(tuỳ chọn)"
              />

              <GenerateButton
                onClick={handleSubmitUserDescription}
                disabled={!userDescription.trim() || isGenerating || (!selectedText && !documentContext.trim())}
                isLoading={isGenerating}
              >
                Tạo với hướng dẫn tùy chỉnh
              </GenerateButton>
            </TabsContent>

            <TabsContent value="custom" className="mt-0 border-0 p-0">
              {/* Category Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex space-x-4">
                  {promptCategories.map((category) => (
                    <CategoryButton
                      key={category.id}
                      category={category}
                      active={activePromptCategory}
                      onClick={setActivePromptCategory}
                    />
                  ))}
                </div>
              </div>

              {/* Template Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {promptTemplates
                  .filter(template => template.category === activePromptCategory)
                  .map(template => (
                    <PromptTemplateCard
                      key={template.key}
                      template={template}
                      onClick={() => {
                        handleTemplateSelection(template.key);
                        if (template.key !== 'translate') {
                          handleQuickSuggestion(template.key);
                        } else {
                          setShowAdvancedOptions(true);
                        }
                      }}
                      disabled={isGenerating || (!selectedText && !documentContext.trim())}
                    />
                  ))}
              </div>

              {/* User Description Input */}
              <TextArea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Thêm bất kỳ hướng dẫn cụ thể nào để tinh chỉnh đầu ra của AI..."
                disabled={isGenerating}
                rows={2}
                label="Hướng dẫn bổ sung (tùy chọn)"
              />

              {/* Advanced Options */}
              {showAdvancedOptions && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                  {/* Language Selection for Translation */}
                  <LanguageSelector
                    value={selectedLanguage}
                    onChange={setSelectedLanguage}
                    options={languageOptions}
                  />

                  <GenerateButton
                    onClick={() => handleQuickSuggestion('translate')}
                    disabled={isGenerating || (!selectedText && !documentContext.trim())}
                    isLoading={isGenerating}
                  >
                   Tạo bản dịch 
                  </GenerateButton>

                  <Button
                    variant="link"
                    size="sm"
                    className="text-gray-500 dark:text-gray-400 text-xs mt-2 p-0 h-auto"
                    onClick={() => setShowAdvancedOptions(false)}
                  >
                    Ẩn lựa chọn 
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* AI Response Display */}
            {aiResponse && (
              <div
                ref={responseRef}
                className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md"
              >
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" /> Phản hổi của AI 
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={handleCopyResponse}
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className={`${isAIInserted ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' : ''}`}
                      onClick={handleInsertAIResponse}
                      disabled={isAIInserted}
                    >
                      {isAIInserted ? (
                        <>
                          <span className="mr-1">✓</span> Đã thêm
                        </>
                      ) : (
                        <>
                          <ArrowRightCircle className="h-4 w-4 mr-1" /> Thêm 
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-4 whitespace-pre-wrap text-sm overflow-y-auto max-h-60 bg-white dark:bg-gray-800 dark:text-gray-200">
                  {aiResponse}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center">
              {hasValidApiKey ? (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Sử dụng Gemini API
                </>
              ) : (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  Gemini API Key không hợp lệ
                </>
              )}
            </div>
            <div className="flex items-center">
              Tip: Nhấn Ctrl+Space để truy cập nhanh trợ lý AI
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistantModal;