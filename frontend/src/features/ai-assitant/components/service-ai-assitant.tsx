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
import { Card, CardContent } from "@/components/ui/card";

import {
  promptTemplates,
  quickSuggestions,
  promptCategories,
  getCustomizedPrompt,
  languageOptions
} from '@/features/ai-assitant/utils/promt-templates';
import { serviceSuggestionPrompts, getServiceSpecificPrompts } from '../utils/service-promt-templates';
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

import { Sparkles, Copy, ArrowRightCircle, LightbulbIcon } from 'lucide-react';

interface ServiceAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  documentContext: string;
  insertContent: (content: string) => void;
  serviceCategory?: string; // Loại dịch vụ: GROOMING, VET, TRAINING, v.v.
}

const ServiceAIAssistantModal: React.FC<ServiceAIAssistantModalProps> = ({
  isOpen,
  onClose,
  selectedText,
  documentContext,
  insertContent,
  serviceCategory,
}) => {
  // State management
  const [userDescription, setUserDescription] = useState<string>('');
  const [aiResponse, setAIResponse] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAIInserted, setIsAIInserted] = useState<boolean>(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Spanish');
  const [focusKeyword, setFocusKeyword] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('service');
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
      setActiveTab('service'); // Mặc định tab dịch vụ
      setActivePromptCategory('refinement');
    }
  }, [isOpen]);

  // Lấy các prompt đặc thù cho dịch vụ
  const servicePrompts = serviceCategory ? getServiceSpecificPrompts(serviceCategory) : [];

  // Handle quick suggestion click
  const handleQuickSuggestion = async (templateKey: string): Promise<void> => {
    setIsGenerating(true);
    setAIResponse(''); // Clear previous responses

    try {
      // Lấy prompt dựa trên templateKey
      let prompt = '';
      
      // Kiểm tra xem có phải service prompt không (bắt đầu bằng 'service-')
      if (templateKey.startsWith('service-')) {
        // Đây là prompt từ danh sách service suggestion
        const servicePromptIndex = parseInt(templateKey.split('-')[1]);
        prompt = servicePrompts[servicePromptIndex] || '';
      } else {
        // Đây là prompt thông thường
        const servicePrompt = serviceSuggestionPrompts.find(p => p.key === templateKey);
        if (servicePrompt) {
          prompt = servicePrompt.prompt;
        } else {
          // Nếu không tìm thấy trong service prompts, thử tìm trong prompt templates
          prompt = getCustomizedPrompt(templateKey, {
            language: selectedLanguage,
            keyword: focusKeyword
          });
        }
      }

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
      alert('Đã sao chép vào clipboard!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl flex items-center">
              <Sparkles className="mr-2 h-5 w-5" /> 
              Trợ lý viết AI
            </DialogTitle>
            
          </div>
          <DialogDescription className="text-purple-100">
            Sử dụng AI để tạo nội dung chuyên nghiệp cho dịch vụ của bạn
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="service"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <TabsList className="mx-6 h-12 bg-transparent">
              <TabsTrigger 
                value="service"
              >
                <LightbulbIcon className="h-4 w-4 mr-2" /> Gợi ý dịch vụ
              </TabsTrigger>
              <TabsTrigger 
                value="suggest"
              >
                <span className="mr-2">⚡</span> Gợi ý nhanh
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

            {/* Tab Service Suggestion */}
            <TabsContent value="service" className="mt-0 border-0 p-0">
              <h3 className="text-base font-medium mb-3">Gợi ý cho dịch vụ {serviceCategory}</h3>
              
              {/* Service Suggestion Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {serviceSuggestionPrompts.map((suggestion) => (
                  <Card 
                    key={suggestion.key}
                    className="hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-all"
                    onClick={() => handleQuickSuggestion(suggestion.key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3 items-center">
                        <div className="text-2xl">{suggestion.icon}</div>
                        <div>
                          <h4 className="font-medium">{suggestion.title}</h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Service Specific Prompts */}
              {servicePrompts.length > 0 && (
                <>
                  <h3 className="text-base font-medium mb-3 mt-6">Gợi ý đặc biệt cho {serviceCategory}</h3>
                  <div className="space-y-3">
                    {servicePrompts.map((prompt, index) => (
                      <Card 
                        key={`service-${index}`}
                        className="hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-all"
                        onClick={() => handleQuickSuggestion(`service-${index}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-2 items-start">
                            <div className="shrink-0 text-lg text-purple-500">✦</div>
                            <p className="text-sm">{prompt.length > 120 ? prompt.substring(0, 120) + '...' : prompt}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* User Description Input */}
              <div className="mt-6">
                <TextArea
                  value={userDescription}
                  onChange={(e) => setUserDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Mô tả thêm yêu cầu của bạn..."
                  disabled={isGenerating}
                  rows={3}
                  label="Hướng dẫn tuỳ chỉnh (tùy chọn)"
                />

                <GenerateButton
                  onClick={handleSubmitUserDescription}
                  disabled={!userDescription.trim() || isGenerating || (!selectedText && !documentContext.trim())}
                  isLoading={isGenerating}
                >
                  Tạo với hướng dẫn tuỳ chỉnh
                </GenerateButton>
              </div>
            </TabsContent>

            {/* Tab Quick Suggestions */}
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
                placeholder="Describe what you want the AI to do with your text..."
                disabled={isGenerating}
                rows={3}
                label="Custom instructions"
              />

              <GenerateButton
                onClick={handleSubmitUserDescription}
                disabled={!userDescription.trim() || isGenerating || (!selectedText && !documentContext.trim())}
                isLoading={isGenerating}
              >
                Generate with Custom Instructions
              </GenerateButton>
            </TabsContent>

            {/* Tab Custom Prompts */}
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
                        if (template.key === 'translate') {
                          setShowAdvancedOptions(true);
                        } else {
                          handleQuickSuggestion(template.key);
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
                placeholder="Add any specific instructions to refine the AI's output..."
                disabled={isGenerating}
                rows={2}
                label="Additional instructions (optional)"
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
                    Generate Translation
                  </GenerateButton>

                  <Button
                    variant="link"
                    size="sm"
                    className="text-gray-500 dark:text-gray-400 text-xs mt-2 p-0 h-auto"
                    onClick={() => setShowAdvancedOptions(false)}
                  >
                    Hide Options
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
                    <Sparkles className="h-4 w-4 mr-2" /> AI Response
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
                          <span className="mr-1">✓</span> Inserted
                        </>
                      ) : (
                        <>
                          <ArrowRightCircle className="h-4 w-4 mr-1" /> Insert
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

export default ServiceAIAssistantModal;