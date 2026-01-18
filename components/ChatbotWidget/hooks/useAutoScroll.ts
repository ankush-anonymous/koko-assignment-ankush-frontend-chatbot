/**
 * Custom hook for auto-scrolling to latest message
 * Preserves scroll position when loading history
 */

import { useEffect, useRef, useState } from 'react';
import { Message } from '../types';

interface UseAutoScrollOptions {
  messages: Message[];
  enabled?: boolean;
  behavior?: ScrollBehavior;
}

export function useAutoScroll(options: UseAutoScrollOptions) {
  const { messages, enabled = true, behavior = 'smooth' } = options;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const lastMessageCountRef = useRef(messages.length);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const messageCountChanged = messages.length !== lastMessageCountRef.current;
    const isNewMessage = messages.length > lastMessageCountRef.current;
    lastMessageCountRef.current = messages.length;

    if (!enabled || !messagesEndRef.current || !containerRef.current) {
      return;
    }

    // Only auto-scroll if:
    // 1. New message was added (count increased)
    // 2. User hasn't manually scrolled up
    if (isNewMessage && !isUserScrolling) {
      // Always scroll to bottom when new message arrives (user hasn't scrolled up)
      // Use requestAnimationFrame and setTimeout to ensure DOM is fully updated
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (messagesEndRef.current && containerRef.current) {
            const container = containerRef.current;
            // Scroll to bottom
            container.scrollTop = container.scrollHeight;
            // Also use scrollIntoView as backup
            messagesEndRef.current.scrollIntoView({ behavior });
          }
        }, 50);
      });
    }
  }, [messages, enabled, behavior, isUserScrolling]);

  // Track user scroll to detect manual scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      
      // User is at bottom if within 100px (more lenient)
      const isAtBottom = distanceFromBottom < 100;
      
      // Use debounce to avoid rapid state changes
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsUserScrolling(!isAtBottom);
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Reset scroll tracking when panel opens
  const resetScrollTracking = () => {
    setIsUserScrolling(false);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    messagesEndRef,
    containerRef,
    resetScrollTracking,
  };
}
