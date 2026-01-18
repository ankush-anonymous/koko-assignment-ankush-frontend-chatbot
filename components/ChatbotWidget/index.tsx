/**
 * Main Chatbot Widget Component
 * Embeddable chatbot widget with floating button and chat panel
 */

'use client';

import React, { useEffect, useCallback } from 'react';
import { ChatbotWidgetProps, ChatState } from './types';
import { useChatState } from './hooks/useChatState';
import { useChatAPI } from './hooks/useChatAPI';
import { useSession } from './hooks/useSession';
import { useBookingState } from './hooks/useBookingState';
import ChatButton from './ChatButton';
import ChatPanel from './ChatPanel';
import './styles.css';

export default function ChatbotWidget({
  botName = 'Chat Assistant',
  initialMessages = [],
  theme = 'light',
  position = 'bottom-right',
  storageKey = 'chatbot-messages',
}: ChatbotWidgetProps) {
  // Get API endpoint from environment variables only
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim() || '';
  const apiRoute = process.env.NEXT_PUBLIC_API_ROUTE?.trim() || 'api/v1/chat';
  
  // Construct full API endpoint URL from environment variables
  let finalApiEndpoint: string | undefined;
  if (baseUrl) {
    // Remove trailing slash from baseUrl and leading slash from apiRoute
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const cleanApiRoute = apiRoute.replace(/^\/+/, '');
    finalApiEndpoint = `${cleanBaseUrl}/${cleanApiRoute}`;
  }

  const {
    messages,
    chatState,
    setChatState,
    addMessage,
    clearMessages,
    isLoading,
    setIsLoading,
  } = useChatState({
    storageKey,
    initialMessages,
  });

  // Session management
  const { sessionId, updateActivity, clearSession, initializeSession } = useSession();

  // Booking state management
  const { bookingState, updateBookingState, resetBookingState, checkTimeout } = useBookingState();

  // API integration
  const { sendMessage: sendAPIMessage, error: apiError } = useChatAPI({
    apiEndpoint: finalApiEndpoint,
    sessionId,
    onMessageReceived: (botMessage) => {
      addMessage({
        text: botMessage.text,
        sender: 'bot',
      });
      setIsLoading(false);
    },
    onBookingStateUpdate: (newBookingState) => {
      updateBookingState(newBookingState);
      updateActivity();
    },
    onError: (errorMessage) => {
      console.error('Chat API error:', errorMessage);
    },
  });

  // Check for timeout periodically
  useEffect(() => {
    if (bookingState.bookingStatus !== null) {
      const interval = setInterval(() => {
        if (checkTimeout()) {
          // Timeout occurred, state was reset
          addMessage({
            text: '⚠️ Your booking session expired due to inactivity.',
            sender: 'bot',
          });
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [bookingState.bookingStatus, checkTimeout, addMessage]);

  // Detect timeout from API response
  useEffect(() => {
    // Check if last bot message contains timeout indicator
    const lastBotMessage = [...messages].reverse().find((msg) => msg.sender === 'bot');
    if (
      lastBotMessage &&
      lastBotMessage.text.includes('expired') &&
      bookingState.bookingStatus === null
    ) {
      // Timeout detected, ensure state is reset
      resetBookingState();
    }
  }, [messages, bookingState.bookingStatus, resetBookingState]);

  // Initialize new session when widget opens after being closed
  useEffect(() => {
    if (chatState === 'open' && !sessionId) {
      initializeSession();
    }
  }, [chatState, sessionId, initializeSession]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !sessionId) {
      return;
    }

    // Add user message immediately
    addMessage({
      text,
      sender: 'user',
    });

    // Update activity
    updateActivity();

    // Send to API and get bot response
    setIsLoading(true);
    await sendAPIMessage(text);
  };

  const handleToggle = async () => {
    if (chatState === 'closed') {
      // Widget is opening - initialize new session if needed
      if (!sessionId) {
        initializeSession();
      }
      setChatState('open');
    } else {
      // Close session on backend when closing
      await closeSession();
      setChatState('closed');
    }
  };

  const handleMinimize = () => {
    setChatState('minimized');
  };

  const handleMaximize = () => {
    setChatState('open');
  };

  // Close session on backend when widget is closed
  const closeSession = useCallback(async () => {
    if (!sessionId) {
      return;
    }

    try {
      // Construct close endpoint URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim() || '';
      let closeEndpoint: string;
      
      if (baseUrl) {
        const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
        closeEndpoint = `${cleanBaseUrl}/api/v1/chat/close`;
      } else if (finalApiEndpoint) {
        // If we have an API endpoint, derive close endpoint from it
        const apiBase = finalApiEndpoint.replace(/\/api\/v1\/chat$/, '');
        closeEndpoint = `${apiBase}/api/v1/chat/close`;
      } else {
        // Fallback to relative path
        closeEndpoint = '/api/v1/chat/close';
      }

      await fetch(closeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    } catch (error) {
      // Don't block widget closing if API call fails
      console.error('Failed to close session:', error);
    } finally {
      // Clear all messages and reset state regardless of API call success/failure
      clearMessages();
      resetBookingState();
      setIsLoading(false);
      // Clear session ID so a new one will be generated on next open
      clearSession();
    }
  }, [sessionId, finalApiEndpoint, clearMessages, resetBookingState, setIsLoading, clearSession]);

  const handleClose = async () => {
    // Close session on backend
    await closeSession();
    // Close widget UI
    setChatState('closed');
  };

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = async (e: KeyboardEvent) => {
      if (e.key === 'Escape' && chatState !== 'closed') {
        // Close session on backend
        await closeSession();
        // Close widget UI
        setChatState('closed');
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [chatState, setChatState, closeSession]);

  return (
    <>
      <ChatButton onClick={handleToggle} position={position} />
      <ChatPanel
        state={chatState}
        botName={botName}
        messages={messages}
        onSendMessage={handleSendMessage}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
        isLoading={isLoading}
        position={position}
        bookingStep={bookingState.bookingStep}
        availableSlots={bookingState.availableSlots}
      />
    </>
  );
}
