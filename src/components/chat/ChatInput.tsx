import { ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import { categoryButtons } from '../../constants/quickQuestions';
import React, { useEffect } from 'react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  showQuickQuestions: boolean;
  setShowQuickQuestions: (show: boolean) => void;
  handleSendMessage: (messageContent?: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLInputElement>;
  isToolInProgress?: boolean;
  stop?: () => void;
}

export default function ChatInput({
  inputValue,
  setInputValue,
  isLoading,
  showQuickQuestions,
  setShowQuickQuestions,
  handleSendMessage,
  handleKeyPress,
  textareaRef,
  isToolInProgress = false,
  stop,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      !e.nativeEvent.isComposing &&
      !isToolInProgress &&
      inputValue.trim()
    ) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isToolInProgress && inputValue.trim()) {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef]);

  return (
    <div className="flex-shrink-0 bg-gray-50 border-t-0">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Quick Questions */}
        {showQuickQuestions && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Quick questions</span>
              <button
                onClick={() => setShowQuickQuestions(false)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100/50"
              >
                <ChevronUp className="w-3 h-3" />
                Hide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryButtons.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(category.prompt)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/70 hover:bg-white border border-gray-200/50 hover:border-gray-300 rounded-xl transition-all duration-200 text-sm group shadow-sm"
                  >
                    <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                    <span className="text-gray-700 group-hover:text-gray-900">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {!showQuickQuestions && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => setShowQuickQuestions(true)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors px-3 py-2 rounded-xl hover:bg-white/50"
            >
              <ChevronDown className="w-3 h-3" />
              Show quick questions
            </button>
          </div>
        )}

        {/* Input Field */}
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="mx-auto flex items-center rounded-full border border-[#E5E5E9] bg-[#ECECF0] py-2 pr-2 pl-6">
            <input
              ref={textareaRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isToolInProgress ? 'Tool is in progress...' : 'Ask me anything'
              }
              className="text-md w-full border-none bg-transparent text-black placeholder:text-gray-500 focus:outline-none"
              disabled={isToolInProgress || isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim() || isToolInProgress}
              className="flex items-center justify-center rounded-full bg-[#0171E3] p-2 text-white disabled:opacity-50"
              onClick={(e) => {
                if (isLoading && stop) {
                  e.preventDefault();
                  stop();
                }
              }}
            >
              <ArrowUp className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}