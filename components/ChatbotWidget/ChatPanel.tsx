/**
 * Chat Panel Component
 * Main container for chat UI with three states: closed, open, minimized
 * Uses inline styles for standalone bundle compatibility
 */

import React, { useEffect, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (state === 'closed') {
    return null;
  }

  const isMinimized = state === 'minimized';
  
  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 999998,
    backgroundColor: '#ffffff',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-out',
    pointerEvents: 'auto',
    ...(isMobile ? {
      // Mobile: full-width bottom sheet
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      maxHeight: isMinimized ? '60px' : '90vh',
      height: isMinimized ? '60px' : '90vh',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
    } : {
      // Desktop: anchored panel
      bottom: '88px',
      right: position === 'bottom-right' ? '24px' : 'auto',
      left: position === 'bottom-left' ? '24px' : 'auto',
      width: '384px',
      maxHeight: isMinimized ? '60px' : '600px',
      height: isMinimized ? '60px' : '600px',
      borderRadius: '12px',
    }),
    transform: isMinimized ? 'translateY(calc(100% - 60px))' : 'translateY(0)',
    opacity: 1,
    overflow: 'hidden',
  };

  return (
    <div style={panelStyle}>
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
