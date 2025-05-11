import React from 'react';
import { QuickSuggestion, PromptTemplate, PromptCategory } from '../utils/promt-templates';

// Tab buttons for navigation
export const TabButton: React.FC<{
  id: string;
  active: string;
  onClick: (id: string) => void;
  icon: string;
  label: string;
}> = ({ id, active, onClick, icon, label }) => (
  <button
    className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center ${
      active === id
        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
    }`}
    onClick={() => onClick(id)}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

// Category button for prompt categories
export const CategoryButton: React.FC<{
  category: PromptCategory;
  active: string;
  onClick: (id: string) => void;
}> = ({ category, active, onClick }) => (
  <button
    className={`py-2 px-1 text-sm font-medium border-b-2 ${
      active === category.id
        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
    }`}
    onClick={() => onClick(category.id)}
  >
    {category.name}
  </button>
);

// Quick suggestion card
export const QuickSuggestionCard: React.FC<{
  suggestion: QuickSuggestion;
  onClick: () => void;
  disabled: boolean;
}> = ({ suggestion, onClick, disabled }) => (
  <button
    key={suggestion.key}
    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-purple-300 dark:hover:border-purple-700 rounded-lg p-3 text-center transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
    onClick={onClick}
    disabled={disabled}
  >
    <div className="text-xl mb-1">{suggestion.icon}</div>
    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-400">
      {suggestion.title}
    </div>
  </button>
);

// Prompt template card
export const PromptTemplateCard: React.FC<{
  template: PromptTemplate;
  onClick: () => void;
  disabled: boolean;
}> = ({ template, onClick, disabled }) => (
  <button 
    key={template.key}
    onClick={onClick}
    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={disabled}
  >
    <div className="text-xl mb-2">{template.icon}</div>
    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">{template.title}</h4>
    <p className="text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
  </button>
);

// Generate button with loading state
export const GenerateButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled, isLoading, children }) => (
  <button 
    className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    onClick={onClick}
    disabled={disabled || isLoading}
  >
    {isLoading ? (
      <>
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang tạo...
      </>
    ) : (
      <>{children}</>
    )}
  </button>
);

// Language selector dropdown
export const LanguageSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}> = ({ value, onChange, options }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Language:</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

// Text input area
export const TextArea: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled: boolean;
  rows?: number;
  label?: string;
}> = ({ value, onChange, onKeyDown, placeholder, disabled, rows = 3, label }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <textarea
      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      rows={rows}
    />
  </div>
);

// Response action buttons
export const ResponseActions: React.FC<{
  onCopy: () => void;
  onInsert: () => void;
  isInserted: boolean;
}> = ({ onCopy, onInsert, isInserted }) => (
  <div className="flex gap-2">
    <button 
      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded"
      onClick={onCopy}
      title="Copy to clipboard"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
      </svg>
    </button>
    <button 
      className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white text-sm py-1 px-3 rounded-md transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center"
      onClick={onInsert}
      disabled={isInserted}
    >
      {isInserted ? (
        <>
          <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Inserted
        </>
      ) : (
        'Insert into document'
      )}
    </button>
  </div>
);

// Selected text preview
export const SelectedTextPreview: React.FC<{
  text: string;
}> = ({ text }) => (
  <div 
    className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-r mb-6"
  >
    <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Nội dung bôi đen:</div>
    <div className="text-gray-600 dark:text-gray-400 text-sm overflow-y-auto max-h-24">{text}</div>
  </div>
);

// Modal footer
export const ModalFooter: React.FC<{
  hasValidApiKey: boolean;
}> = ({ hasValidApiKey }) => (
  <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
    <div className="flex items-center">
      {hasValidApiKey && (
        <>
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Sử dụng Gemini API
        </>
      )}
    </div>
    <div className="flex items-center">
      Tip: Nhấn Ctrl+Space để truy cập nhanh trợ lý AI
    </div>
  </div>
);