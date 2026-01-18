/**
 * Custom hook for API integration
 * Implements the veterinary chatbot API as per frontend_info.md
 */

import { useState, useCallback } from 'react';
import { Message, ChatAPIRequest, ChatAPIResponse, BookingState } from '../types';

interface UseChatAPIOptions {
  apiEndpoint?: string;
  sessionId: string | null;
  onMessageReceived?: (message: Message) => void;
  onBookingStateUpdate?: (bookingState: BookingState) => void;
  onError?: (error: string) => void;
}

export function useChatAPI(options: UseChatAPIOptions) {
  const { apiEndpoint, sessionId, onMessageReceived, onBookingStateUpdate, onError } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (userMessage: string): Promise<ChatAPIResponse | null> => {
      if (!userMessage.trim() || !sessionId) {
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (!apiEndpoint) {
          // Placeholder mode
          await new Promise((resolve) => setTimeout(resolve, 500));
          const placeholderResponse: ChatAPIResponse = {
            success: true,
            message: `You said: "${userMessage}". This is a placeholder response. Configure an API endpoint to get real responses.`,
            bookingStatus: null,
            bookingStep: null,
            availableSlots: undefined,
          };

          if (onMessageReceived) {
            onMessageReceived({
              id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              text: placeholderResponse.message || '',
              sender: 'bot',
              timestamp: Date.now(),
            });
          }

          if (onBookingStateUpdate) {
            onBookingStateUpdate({
              bookingStatus: null,
              bookingStep: null,
              availableSlots: null, // BookingState allows null
              lastActivityTime: Date.now(),
            });
          }

          return placeholderResponse;
        }

        // Real API call
        const requestBody: ChatAPIRequest = {
          sessionId,
          userMessage: userMessage.trim(),
        };

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }

        const data: ChatAPIResponse = await response.json();

        // Handle API errors
        if (!data.success) {
          const errorMessage = data.details || data.error || 'An error occurred';
          setError(errorMessage);
          
          if (onError) {
            onError(errorMessage);
          }

          // Still show error message in chat
          if (onMessageReceived) {
            onMessageReceived({
              id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              text: `Error: ${errorMessage}`,
              sender: 'bot',
              timestamp: Date.now(),
            });
          }

          return data;
        }

        // Handle successful response
        if (data.message) {
          if (onMessageReceived) {
            onMessageReceived({
              id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              text: data.message,
              sender: 'bot',
              timestamp: Date.now(),
            });
          }
        }

        // Update booking state
        if (onBookingStateUpdate) {
          const bookingState: BookingState = {
            bookingStatus: data.bookingStatus ?? null,
            bookingStep: data.bookingStep ?? null,
            availableSlots: data.availableSlots ?? null,
            lastActivityTime: Date.now(),
          };
          onBookingStateUpdate(bookingState);
        }

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
        setError(errorMessage);
        console.error('Chat API error:', err);

        if (onError) {
          onError(errorMessage);
        }

        // Show error message in chat
        if (onMessageReceived) {
          onMessageReceived({
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: errorMessage,
            sender: 'bot',
            timestamp: Date.now(),
          });
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiEndpoint, sessionId, onMessageReceived, onBookingStateUpdate, onError]
  );

  return {
    sendMessage,
    isLoading,
    error,
  };
}
