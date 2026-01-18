/**
 * Scrollable Message List Component
 * Handles message display and scrolling
 */

import React, { useEffect, useRef } from 'react';
import { Message } from './types';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { useAutoScroll } from './hooks/useAutoScroll';

interface MessageListProps {
  messages: Message[];
  isMinimized?: boolean;
  isLoading?: boolean;
}

export default function MessageList({ messages, isMinimized = false, isLoading = false }: MessageListProps) {
  const { messagesEndRef, containerRef, resetScrollTracking } = useAutoScroll({
    messages,
    enabled: !isMinimized,
  });

  // Reset scroll tracking only when panel first opens (not on every render)
  const hasOpenedRef = useRef(false);
  useEffect(() => {
    if (!isMinimized && !hasOpenedRef.current) {
      hasOpenedRef.current = true;
      // Small delay to ensure container is rendered
      setTimeout(() => {
        resetScrollTracking();
      }, 100);
    }
    if (isMinimized) {
      hasOpenedRef.current = false;
    }
  }, [isMinimized, resetScrollTracking]);

  // Scroll to typing indicator when it appears
  useEffect(() => {
    if (isLoading && messagesEndRef.current && containerRef.current) {
      const container = containerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isNearBottom) {
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Scroll to bottom when bot response arrives (isLoading changes from true to false)
  const prevLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (prevLoadingRef.current && !isLoading && messagesEndRef.current && containerRef.current) {
      // Bot response just arrived, scroll to bottom
      const container = containerRef.current;
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (container && messagesEndRef.current) {
            // Force scroll to bottom
            container.scrollTop = container.scrollHeight;
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      });
    }
    prevLoadingRef.current = isLoading;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isMinimized) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#ffffff',
    scrollBehavior: 'smooth',
  };

  const emptyStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#6b7280',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {messages.length === 0 ? (
        <div style={emptyStyle}>
          <p>Start a conversation...</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
