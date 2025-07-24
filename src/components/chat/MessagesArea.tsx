import { MessageCircle, UserIcon, Loader2 } from 'lucide-react';
import { Carousel, Card } from '../projects/apple-cards-carousel';
import { data as projectData } from '../projects/Data';
import ProfileCard, { profileData } from '../ui/ProfileCard';
import Skills from '../ui/skills';
import Contact from '../ui/contact';
import Resume from '../ui/resume';
import Crazy from '../ui/crazy';
import { Message } from '../../types/chat';

interface MessagesAreaProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function MessagesArea({
  messages,
  isLoading,
  messagesEndRef,
}: MessagesAreaProps) {
  
  // Helper function to determine if chat icon should be shown
  const shouldShowChatIcon = (currentIndex: number, messages: Message[]): boolean => {
    if (currentIndex === 0) return true; // Always show for first message
    
    const currentMessage = messages[currentIndex];
    const previousMessage = messages[currentIndex - 1];
    
    // Show chat icon if:
    // 1. Current message is from user, OR
    // 2. Previous message is from user (role change)
    return currentMessage.role === 'user' || previousMessage.role === 'user';
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 pt-20">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-xl font-semibold text-gray-700 mb-2">Start a conversation!</p>
            <p className="text-sm text-gray-500">Ask me about projects, skills, or anything else.</p>
          </div>
        )}
        
        <div className="space-y-6">
          {messages.map((message, index) => {
            const showIcon = shouldShowChatIcon(index, messages);
            
            return (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Conditional Chat Icon */}
                {showIcon ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-white'
                  }`}>
                    {message.role === 'user' ? 
                      <UserIcon className="w-4 h-4" fill="currentColor" /> : 
                      <MessageCircle className="w-4 h-4" fill="currentColor" />
                    }
                  </div>
                ) : (
                  // Empty space to maintain alignment when no icon (only for assistant messages)
                  message.role === 'assistant' && <div className="w-8 h-8 flex-shrink-0"></div>
                )}
                
                <div className={`${message.type && ['profile', 'skills', 'contact', 'resume', 'fun'].includes(message.type) ? 'w-full' : 'max-w-[80%]'} flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-6 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {message.type === 'projects' && (
                    <div className="mt-6 w-full">
                      <Carousel
                        items={projectData.map((card, index) => (
                          <Card key={index} card={card} index={index} layout />
                        ))}
                      />
                    </div>
                  )}
                  
                  {message.type === 'profile' && (
                    <div className="mt-6 w-full">
                      <ProfileCard {...profileData} />
                    </div>
                  )}
                  
                  {message.type === 'skills' && (
                    <div className="mt-6 w-full">
                      <Skills />
                    </div>
                  )}

                  {message.type === 'contact' && (
                    <div className="mt-6 w-full">
                      <Contact />
                    </div>
                  )}

                  {message.type === 'resume' && (
                    <div className="mt-6 w-full">
                      <Resume />
                    </div>
                  )}

                  {message.type === 'fun' && (
                    <div className="mt-6 w-full">
                      <Crazy />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <div className="bg-white border border-gray-200 px-6 py-3 rounded-2xl max-w-[70%] shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-900">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}