/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatScreen from './chat/ChatScreen';
import { Message } from '../types/chat';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const processingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate unique ID using timestamp + random number
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Common exclusion keywords that should go to RAG instead of components
  const RAG_KEYWORDS = [
    // Philosophy & Approach
    'philosophy', 'approach', 'methodology', 'mindset', 'values', 'principles',
    'beliefs', 'perspective', 'viewpoint', 'opinion', 'thoughts on',
    
    // Experience & Background  
    'experience', 'background', 'history', 'journey', 'career path', 'story',
    'how did you', 'why did you', 'when did you start', 'how long have you',
    
    // Education & Learning
    'education', 'degree', 'university', 'college', 'studied', 'learned',
    'courses', 'certification details', 'academic', 'school',
    
    // Detailed Technical Questions
    'how do you', 'what do you think', 'explain', 'difference between',
    'compare', 'vs', 'versus', 'better than', 'why use', 'when to use',
    
    // Goals & Future
    'goals', 'aspirations', 'future', 'next', 'planning', 'want to',
    'dream', 'vision', 'ambition', 'hope to', 'aim to',
    
    // Process & Methods
    'process', 'method', 'way', 'how you', 'your way of', 'strategy',
    'technique', 'practice', 'workflow', 'system',
    
    // Opinions & Preferences
    'favorite', 'prefer', 'like', 'dislike', 'hate', 'love', 'best',
    'worst', 'recommend', 'suggest', 'advice', 'tip',
    
    // Availability & Opportunities
    'available', 'hiring', 'opportunity', 'job', 'work', 'freelance',
    'contract', 'full-time', 'part-time', 'remote',
    
    // Achievements & Detailed Info
    'achievement', 'award', 'recognition', 'accomplishment', 'success',
    'proud of', 'biggest', 'most', 'challenge', 'difficult',
    
    // Learning & Development
    'learning', 'studying', 'currently', 'now', 'recently', 'latest',
    'new', 'trend', 'technology', 'framework'
  ];

  // Function to check if a message should go to RAG instead of components
  const shouldGoToRAG = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    // Check for RAG keywords
    const hasRAGKeywords = RAG_KEYWORDS.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    // Check for question patterns that should go to RAG
    const ragPatterns = [
      /^(what do you think|how do you|why do you|when do you|where do you)/,
      /^(tell me about your|explain your|describe your)/,
      /^(what is your|what are your).*(philosophy|approach|opinion|view)/,
      /^(how did you|why did you|when did you)/,
      /\b(vs|versus|compared to|better than)\b/,
      /\b(favorite|prefer|recommend|suggest|advice)\b/,
      /\b(currently|recently|latest|new|future|next)\b/,
      /\?(.*)(philosophy|approach|experience|opinion|think|feel)/
    ];
    
    const hasRAGPatterns = ragPatterns.some(pattern => 
      pattern.test(lowerMessage)
    );
    
    return hasRAGKeywords || hasRAGPatterns;
  };

  // Updated detection functions with comprehensive exclusion logic
  const isProfileQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim();
    
    // First check if it should go to RAG
    if (shouldGoToRAG(message)) {
      return false;
    }
    
    // Exact profile-focused phrases (only basic profile info)
    const exactProfileMatches = [
      'show me your profile',
      'your profile',
      'profile card',
      'about you',
      'who are you',
      'introduce yourself'
    ];
    
    // Only match if it's exactly these phrases or very close
    if (exactProfileMatches.some(phrase => 
      lowerMessage === phrase || 
      (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 10)
    )) {
      return true;
    }
    
    // Very specific profile patterns
    const profilePatterns = [
      /^(show me\s+)?(your\s+)?profile$/,
      /^profile$/,
      /^who\s+are\s+you\??$/,
      /^about\s+you$/,
      /^introduce\s+yourself$/
    ];
    
    return profilePatterns.some(pattern => pattern.test(lowerMessage));
  };

  const isProjectsQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim();
    
    // First check if it should go to RAG
    if (shouldGoToRAG(message)) {
      return false;
    }
    
    const exactProjectMatches = [
      'show me your projects',
      'your projects',
      'show projects',
      'projects'
    ];
    
    // Only match exact or very close matches
    if (exactProjectMatches.some(phrase => 
      lowerMessage === phrase || 
      (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 10)
    )) {
      return true;
    }
    
    const projectPatterns = [
      /^(show me\s+)?(your\s+)?projects?$/,
      /^projects?$/,
      /^portfolio$/
    ];
    
    return projectPatterns.some(pattern => pattern.test(lowerMessage));
  };

  const isSkillsQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim();
    
    // First check if it should go to RAG
    if (shouldGoToRAG(message)) {
      return false;
    }
    
    const exactSkillsMatches = [
      'show me your skills',
      'your skills',
      'skills'
    ];
    
    // Only match exact or very close matches
    if (exactSkillsMatches.some(phrase => 
      lowerMessage === phrase || 
      (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 10)
    )) {
      return true;
    }
    
    const skillPatterns = [
      /^(show me\s+)?(your\s+)?skills?$/,
      /^skills?$/
    ];
    
    return skillPatterns.some(pattern => pattern.test(lowerMessage));
  };

  const isContactQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim();
    
    // First check if it should go to RAG (but contact info is usually ok to show)
    // Only exclude if it's asking about contact philosophy or approach
    if (lowerMessage.includes('philosophy') || lowerMessage.includes('approach') || 
        lowerMessage.includes('prefer') || lowerMessage.includes('method')) {
      return false;
    }
    
    const exactContactMatches = [
      'show me your contact details',
      'your contact details',
      'contact details',
      'contact',
      'how can i contact you',
      'contact you'
    ];
    
    if (exactContactMatches.some(phrase => 
      lowerMessage === phrase || 
      (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 15)
    )) {
      return true;
    }
    
    const contactPatterns = [
      /^(show me\s+)?(your\s+)?contact(\s+details)?$/,
      /^contact$/,
      /^how\s+(can\s+)?i\s+contact\s+you$/
    ];
    
    return contactPatterns.some(pattern => pattern.test(lowerMessage));
  };

  const isResumeQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Resume queries are usually straightforward, but check for detailed questions
    if (lowerMessage.includes('tell me about') || lowerMessage.includes('explain') ||
        lowerMessage.includes('details about') || lowerMessage.includes('experience in')) {
      return false;
    }
    
    const exactResumeMatches = [
      'show me your resume',
      'your resume',
      'resume',
      'download resume',
      'cv'
    ];
    
    if (exactResumeMatches.some(phrase => 
      lowerMessage === phrase || 
      (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 10)
    )) {
      return true;
    }
    
    const resumePatterns = [
      /^(show me\s+)?(your\s+)?resume$/,
      /^resume$/,
      /^cv$/,
      /^download\s+resume$/
    ];
    
    return resumePatterns.some(pattern => pattern.test(lowerMessage));
  };

  const isFunQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim();
    
    // First check if it should go to RAG
    if (shouldGoToRAG(message)) {
      return false;
    }
    
    const exactFunMatches = [
      'show me your adventure photos',
      'adventure photos',
      'fun photos',
      'kedarnath trek'
    ];
    
    if (exactFunMatches.some(phrase => 
      lowerMessage === phrase || 
      (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 10)
    )) {
      return true;
    }
    
    const funPatterns = [
      /^(show me\s+)?adventure\s+photos?$/,
      /^kedarnath$/,
      /^fun\s+photos?$/
    ];
    
    return funPatterns.some(pattern => pattern.test(lowerMessage));
  };

  const isMoreQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim();
    
    const exactMoreMatches = [
      'show me more options',
      'more options',
      'more',
      'what else'
    ];
    
    if (exactMoreMatches.some(phrase => 
      lowerMessage === phrase || 
      (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 5)
    )) {
      return true;
    }
    
    const morePatterns = [
      /^(show me\s+)?more(\s+options)?$/,
      /^more$/,
      /^what\s+else$/
    ];
    
    return morePatterns.some(pattern => pattern.test(lowerMessage));
  };

  // Priority-based message type detection
  const getMessageType = (message: string): 'profile' | 'projects' | 'skills' | 'contact' | 'resume' | 'fun' | 'more' | undefined => {
    // Check in order of specificity (most specific first)
    if (isResumeQuery(message)) return 'resume';
    if (isContactQuery(message)) return 'contact';
    if (isFunQuery(message)) return 'fun';
    if (isSkillsQuery(message)) return 'skills';
    if (isProjectsQuery(message)) return 'projects';
    if (isProfileQuery(message)) return 'profile';
    if (isMoreQuery(message)) return 'more';
    
    return undefined;
  };

  const processMessage = useCallback(async (content: string, chatHistory: Message[] = []) => {
    // Prevent duplicate processing of the same message
    if (processingRef.current.has(content) || isLoading) {
      console.log('Skipping duplicate or already processing:', content);
      return;
    }
    
    console.log('Processing message:', content);
    processingRef.current.add(content);
    setIsLoading(true);

    try {
      let responseContent = '';
      const messageType = getMessageType(content);

      // Check for component queries using the unified detection
      if (messageType === 'profile') {
        responseContent = 'Here\'s my profile:';
        
        // Add immediate follow-up response for profile
        setTimeout(() => {
          const followUpMessage: Message = {
            id: generateUniqueId(),
            role: 'assistant',
            content: "That's me in a nutshell! 👆 I'm passionate about creating innovative solutions and always excited to take on new challenges. Love working on projects that make a real impact! \n\nWhat kind of projects are you working on?",
            timestamp: new Date()
          };

          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }
      else if (messageType === 'projects') {
        responseContent = 'Here are some of my recent projects:';
        
        // Add immediate follow-up response for projects
        setTimeout(() => {
          const followUpMessage: Message = {
            id: generateUniqueId(),
            role: 'assistant',
            content: "These are some of my favorite projects I've worked on! Each one taught me something new and pushed my skills further. I love building things that solve real problems 🚀\n\nWhich project caught your eye?",
            timestamp: new Date()
          };

          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }
      else if (messageType === 'skills') {
        responseContent = 'Here are my skills and expertise:';
        
        // Add Gemini-generated follow-up response for skills
        setTimeout(async () => {
          try {
            const followUpResponse = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: `I just showed my skills component above. Now give a casual, friendly follow-up message that references the skills shown above, uses emojis, and asks an engaging question to continue the conversation. Keep it conversational and personal. Original user question was: "${content}"`,
                chatHistory: chatHistory.slice(-6)
              })
            });

            const followUpData = await followUpResponse.json();
            const followUpContent = followUpData.response || "You can check out all my skills above! I've got a mix of hard skills like coding in various languages and soft skills like communication and problem-solving. Pretty handy, right? 😄\n\nWhat skills are you looking for in a developer?";

            const followUpMessage: Message = {
              id: generateUniqueId(),
              role: 'assistant',
              content: followUpContent,
              timestamp: new Date()
            };

            setMessages(prev => [...prev, followUpMessage]);
          } catch (error) {
            console.error('Error getting follow-up response:', error);
            // Fallback to hardcoded message if API fails
            const fallbackMessage: Message = {
              id: generateUniqueId(),
              role: 'assistant',
              content: "You can check out all my skills above! I've got a mix of hard skills like coding in various languages and soft skills like communication and problem-solving. Pretty handy, right? 😄\n\nWhat skills are you looking for in a developer?",
              timestamp: new Date()
            };
            setMessages(prev => [...prev, fallbackMessage]);
          }
        }, 1000);
      }
      else if (messageType === 'contact') {
        responseContent = 'Here\'s how you can reach me:';
        
        setTimeout(() => {
          const followUpMessage: Message = {
            id: generateUniqueId(),
            role: 'assistant',
            content: "Feel free to reach out through any of these channels! 📬 I'm always excited to connect with new people and discuss potential opportunities or collaborations.\n\nWhat would you like to chat about?",
            timestamp: new Date()
          };

          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }
      else if (messageType === 'resume') {
        responseContent = 'Here\'s my resume - you can download it:';
        
        setTimeout(() => {
          const followUpMessage: Message = {
            id: generateUniqueId(),
            role: 'assistant',
            content: "Click the download button above to get my latest resume! 📄 It includes all my experience, projects, and technical skills in a neat PDF format.\n\nAny specific role or opportunity you have in mind?",
            timestamp: new Date()
          };

          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }
      else if (messageType === 'fun') {
        responseContent = 'Check out my Kedarnath trek adventure:';
        
        setTimeout(() => {
          const followUpMessage: Message = {
            id: generateUniqueId(),
            role: 'assistant',
            content: "That was such an incredible experience! 🏔️ Kedarnath is one of those places that really tests your limits and rewards you with breathtaking views. The journey was challenging but so worth it!\n\nDo you enjoy trekking or outdoor adventures too?",
            timestamp: new Date()
          };

          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }
      else if (messageType === 'more') {
        responseContent = 'Here are more things you can ask me about:';
        
        setTimeout(() => {
          const followUpMessage: Message = {
            id: generateUniqueId(),
            role: 'assistant',
            content: "Feel free to click on any of the topics above to learn more about me! 😊 I'm here to answer any questions you might have.\n\nWhat interests you the most?",
            timestamp: new Date()
          };

          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }
      // Regular API call for all other queries (including philosophy, experience, etc.)
      else {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: content,
              chatHistory: chatHistory.slice(-6)
            })
          });

          const data = await response.json();
          responseContent = data.response || "Sorry, something went wrong. Please try again!";
        } catch (error) {
          console.error('Error calling API:', error);
          responseContent = "I'm having trouble connecting right now. Please try again in a moment.";
        }
      }

      console.log('Message type detected:', messageType);

      // Add assistant response immediately for special types, with a small delay for API responses
      const delay = messageType ? 500 : 100;
      
      setTimeout(() => {
        const assistantMessage: Message = {
          id: generateUniqueId(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          ...(messageType && { type: messageType })
        };

        console.log('Adding assistant message:', assistantMessage);
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        processingRef.current.delete(content);
      }, delay);

    } catch (error) {
      console.error('Error processing message:', error);
      setIsLoading(false);
      processingRef.current.delete(content);
    }
  }, [isLoading]);

  const handleSendMessage = useCallback(async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content || isLoading) return;

    console.log('Sending message:', content);

    const userMessage: Message = {
      id: generateUniqueId(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      // Process the message with the updated messages array
      setTimeout(() => processMessage(content, newMessages), 50);
      return newMessages;
    });
    setInputValue('');
  }, [inputValue, isLoading, processMessage]);

  // Handle initial query from URL - only run once
  useEffect(() => {
    if (initialized) return;
    
    const query = searchParams?.get('query');
    if (query) {
      setInitialized(true);
      
      const userMessage: Message = {
        id: generateUniqueId(),
        role: 'user',
        content: query,
        timestamp: new Date()
      };

      setMessages([userMessage]);
      processMessage(query, [userMessage]);
    } else {
      setInitialized(true);
    }
  }, [searchParams, initialized, processMessage]);

  return (
    <ChatScreen
      messages={messages}
      inputValue={inputValue}
      setInputValue={setInputValue}
      isLoading={isLoading}
      showQuickQuestions={showQuickQuestions}
      setShowQuickQuestions={setShowQuickQuestions}
      handleSendMessage={handleSendMessage}
      messagesEndRef={messagesEndRef}
      textareaRef={textareaRef}
      onSendMessage={handleSendMessage}
    />
  );
}