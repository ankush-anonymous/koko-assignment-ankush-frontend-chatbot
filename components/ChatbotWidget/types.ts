/**
 * Chatbot Widget TypeScript Types and Interfaces
 */

export type ChatState = 'closed' | 'open' | 'minimized';

export type MessageSender = 'user' | 'bot';

export type BookingStatus = 'initiated' | 'pending' | 'completed' | null;

export type BookingStep =
  | 'ASK_EMAIL'
  | 'ASK_OWNER_NAME'
  | 'ASK_PET_NAME'
  | 'ASK_PHONE'
  | 'ASK_DATE'
  | 'SHOW_SLOTS'
  | 'CONFIRM_SLOT'
  | null;

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: number;
}

export interface TimeSlot {
  id: string;
  date?: string; // Date in YYYY-MM-DD format
  startTime: string; // ISO 8601 date string
  endTime: string; // ISO 8601 date string
}

export interface ChatAPIRequest {
  sessionId: string;
  userMessage: string;
}

export interface ChatAPIResponse {
  success: boolean;
  message?: string;
  bookingStatus?: BookingStatus;
  bookingStep?: BookingStep;
  availableSlots?: TimeSlot[];
  error?: string;
  details?: string;
}

export interface BookingState {
  bookingStatus: BookingStatus;
  bookingStep: BookingStep;
  availableSlots: TimeSlot[] | null;
  lastActivityTime: number;
}

export interface ChatbotWidgetProps {
  botName?: string;
  initialMessages?: Message[];
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left';
  storageKey?: string; // Key for localStorage persistence
}

export interface ChatStateContextType {
  state: ChatState;
  setState: (state: ChatState) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
