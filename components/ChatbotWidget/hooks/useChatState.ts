/**
 * Custom hook for managing chat state and messages
 * Handles state persistence to localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { Message, ChatState } from '../types';

interface UseChatStateOptions {
  storageKey?: string;
  initialMessages?: Message[];
}

export function useChatState(options: UseChatStateOptions = {}) {
  const { storageKey = 'chatbot-messages', initialMessages = [] } = options;
  
  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed : initialMessages;
        }
      } catch (error) {
        console.error('Error loading messages from localStorage:', error);
      }
    }
    return initialMessages;
  });

  const [chatState, setChatState] = useState<ChatState>('closed');
  const [isLoading, setIsLoading] = useState(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving messages to localStorage:', error);
      }
    }
  }, [messages, storageKey]);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error('Error clearing messages from localStorage:', error);
      }
    }
  }, [storageKey]);

  return {
    messages,
    chatState,
    setChatState,
    addMessage,
    clearMessages,
    isLoading,
    setIsLoading,
  };
}
