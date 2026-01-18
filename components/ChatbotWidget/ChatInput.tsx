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

  const containerStyle: React.CSSProperties = {
    padding: '16px',
    borderTop: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
  };

  const inputRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  };

  const textareaStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    color: '#000000',
    fontSize: '14px',
    resize: 'none',
    maxHeight: '128px',
    overflowY: 'auto',
    outline: 'none',
    backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
    cursor: disabled ? 'not-allowed' : 'text',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px',
    backgroundColor: disabled || !inputValue.trim() ? '#d1d5db' : '#000000',
    color: '#ffffff',
    borderRadius: '8px',
    border: 'none',
    cursor: disabled || !inputValue.trim() ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s',
    outline: 'none',
  };

  const hintStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '8px',
  };

  return (
    <div style={containerStyle}>
      <div style={inputRowStyle}>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={textareaStyle}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          style={buttonStyle}
          onMouseEnter={(e) => {
            if (!disabled && inputValue.trim()) {
              e.currentTarget.style.backgroundColor = '#333333';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && inputValue.trim()) {
              e.currentTarget.style.backgroundColor = '#000000';
            }
          }}
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '20px', height: '20px' }}
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
        <p style={hintStyle}>
          Press Enter to send, Shift+Enter for newline
        </p>
      )}
    </div>
  );
}
