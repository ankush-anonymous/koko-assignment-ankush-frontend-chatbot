/**
 * Chat Input Component
 * Fixed input box with send button and keyboard shortcuts
 */

import React, { useState, useRef, useEffect } from 'react';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { BookingStep, TimeSlot } from './types';
import BookingInputs from './BookingInputs';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  bookingStep?: BookingStep;
  availableSlots?: TimeSlot[] | null;
}

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
  bookingStep = null,
  availableSlots = null,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { handleKeyDown } = useKeyboardShortcuts({
    onSend: () => {
      if (inputValue.trim() && !disabled) {
        onSend(inputValue.trim());
        setInputValue('');
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    },
    disabled,
  });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="p-4 border-t border-gray-300 bg-white rounded-b-lg">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="
            flex-1
            px-4 py-2
            border border-gray-300 rounded-lg
            text-black
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
            resize-none
            max-h-32
            overflow-y-auto
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
          "
        />
        <button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          className="
            p-2
            bg-black hover:bg-gray-800
            text-white
            rounded-lg
            transition-colors
            disabled:bg-gray-300 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
          "
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
      {bookingStep && (
        <BookingInputs
          bookingStep={bookingStep}
          availableSlots={availableSlots}
          onSelect={onSend}
        />
      )}
      {!bookingStep && (
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for newline
        </p>
      )}
    </div>
  );
}
