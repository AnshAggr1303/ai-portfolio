import { ChevronLeft } from 'lucide-react';
import MessagesArea from './MessagesArea';
import ChatInput from './ChatInput';
import { Message } from '../../types/chat';

interface ChatScreenProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  showQuickQuestions: boolean;
  setShowQuickQuestions: (show: boolean) => void;
  handleBackClick: () => void;
  handleSendMessage: (messageContent?: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export default function ChatScreen({
  messages,
  inputValue,
  setInputValue,
  isLoading,
  showQuickQuestions,
  setShowQuickQuestions,
  handleBackClick,
  handleSendMessage,
  handleKeyPress,
  messagesEndRef,
  textareaRef,
}: ChatScreenProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* Floating Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm hover:shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Messages Area - Scrollable */}
      <MessagesArea
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      {/* Input Area - Fixed at Bottom */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        showQuickQuestions={showQuickQuestions}
        setShowQuickQuestions={setShowQuickQuestions}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
        textareaRef={textareaRef}
      />
    </div>
  );
}