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

  const handleBackClick = () => {
    router.push('/');
  };

  const isProjectsQuery = (message: string): boolean => {
    const projectKeywords = ['project', 'projects', 'work', 'portfolio', 'built', 'created', 'developed', 'app', 'website'];
    return projectKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const isProfileQuery = (message: string): boolean => {
    const profileKeywords = ['about you', 'who are you', 'yourself', 'tell me about', 'your background', 'introduce', 'profile'];
    return profileKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const isSkillsQuery = (message: string): boolean => {
    const skillsKeywords = ['skill', 'skills', 'expertise', 'technologies', 'tech stack', 'what can you do', 'abilities', 'programming languages', 'tools', 'frameworks'];
    return skillsKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const isContactQuery = (message: string): boolean => {
    const contactKeywords = ['contact', 'reach out', 'get in touch', 'connect', 'email', 'phone', 'social media', 'linkedin', 'github', 'how to contact', 'reach you'];
    return contactKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const isResumeQuery = (message: string): boolean => {
    const resumeKeywords = ['resume', 'cv', 'curriculum vitae', 'download resume', 'download cv', 'your resume', 'your cv'];
    return resumeKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const isFunQuery = (message: string): boolean => {
    const funKeywords = ['trek', 'trekking', 'kedarnath', 'adventure', 'hiking', 'mountains', 'travel', 'crazy', 'craziest', 'fun photos', 'personal life', 'hobbies', 'fun', 'wildest', 'most adventurous', 'coolest thing', 'exciting', 'memorable'];
    return funKeywords.some(keyword => message.toLowerCase().includes(keyword));
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
      let messageType: 'profile' | 'projects' | 'skills' | 'contact' | 'resume' | 'fun' | undefined;

      // Check for profile queries
      if (isProfileQuery(content)) {
        responseContent = 'Here\'s my profile:';
        messageType = 'profile';
        
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
      // Check for projects queries
      else if (isProjectsQuery(content)) {
        responseContent = 'Here are some of my recent projects:';
        messageType = 'projects';
        
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
      // Check for skills queries
      else if (isSkillsQuery(content)) {
        responseContent = 'Here are my skills and expertise:';
        messageType = 'skills';
        
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
      // Check for contact queries
      else if (isContactQuery(content)) {
        responseContent = 'Here\'s how you can reach me:';
        messageType = 'contact';
        
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
      // Check for resume queries
      else if (isResumeQuery(content)) {
        responseContent = 'Here\'s my resume - you can download it:';
        messageType = 'resume';
        
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
      // Check for fun/adventure queries
      else if (isFunQuery(content)) {
        responseContent = 'Check out my Kedarnath trek adventure:';
        messageType = 'fun';
        
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
      // Regular API call
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
  }, []);

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
      handleBackClick={handleBackClick}
      handleSendMessage={handleSendMessage}
      messagesEndRef={messagesEndRef}
      textareaRef={textareaRef}
    />
  );
}