import { Suspense } from 'react';
import ChatInterface from '@/components/ChatInterface';

// Loading component for Suspense
function ChatLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatInterface />
    </Suspense>
  );
}