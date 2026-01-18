/**
 * Chat Panel Component
 * Main container for chat UI with three states: closed, open, minimized
 */

import React from 'react';
import { ChatState, Message, BookingStep, TimeSlot } from './types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import './styles.css';

interface ChatPanelProps {
  state: ChatState;
  botName?: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  isLoading?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  bookingStep?: BookingStep;
  availableSlots?: TimeSlot[] | null;
}

export default function ChatPanel({
  state,
  botName,
  messages,
  onSendMessage,
  onMinimize,
  onMaximize,
  onClose,
  isLoading = false,
  position = 'bottom-right',
  bookingStep = null,
  availableSlots = null,
}: ChatPanelProps) {
  if (state === 'closed') {
    return null;
  }

  const isMinimized = state === 'minimized';
  
  // Desktop positioning: align with button
  // Button is at bottom-6 (24px) with height h-14 (56px), so top is at 80px
  // Panel should be positioned right above button with small gap (8px = 88px total)
  // Match button's responsive position: right-4 md:right-6 (button) -> md:right-6 for panel
  const desktopPositionClasses =
    position === 'bottom-right' 
      ? 'md:bottom-[88px] md:right-6' 
      : 'md:bottom-[88px] md:left-6';
  
  // Mobile: full-width bottom sheet
  // Desktop: anchored to button position, right above it
  return (
    <div
      className={`
        chatbot-widget-container
        fixed
        bottom-0 left-0 right-0
        md:left-auto
        ${desktopPositionClasses}
        z-[999998]
        w-full
        md:w-96
        max-h-[90vh]
        md:max-h-[600px]
        bg-white
        rounded-t-lg
        md:rounded-lg
        shadow-2xl
        flex flex-col
        transition-all duration-300 ease-out
        ${isMinimized ? 'chatbot-panel-minimized max-h-[60px]' : 'h-[90vh] md:h-[600px]'}
      `}
      style={{
        transform: 
          state === 'minimized' 
            ? 'translateY(calc(100% - 60px))' 
            : 'translateY(0)',
        opacity: 1,
      }}
    >
      <ChatHeader
        botName={botName}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
        isMinimized={isMinimized}
      />
      {!isMinimized && (
        <>
          <MessageList messages={messages} isMinimized={isMinimized} isLoading={isLoading} />
          <ChatInput
            onSend={onSendMessage}
            disabled={isLoading}
            bookingStep={bookingStep}
            availableSlots={availableSlots}
          />
        </>
      )}
    </div>
  );
}
