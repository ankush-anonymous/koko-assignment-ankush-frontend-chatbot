/**
 * Custom hook for booking state management
 * Tracks booking status, step, and available slots
 */

import { useState, useCallback, useEffect } from 'react';
import { BookingState, BookingStatus, BookingStep, TimeSlot } from '../types';

const BOOKING_STATE_STORAGE_KEY = 'vetChatbot_bookingState';

export function useBookingState() {
  const [bookingState, setBookingState] = useState<BookingState>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(BOOKING_STATE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            bookingStatus: parsed.bookingStatus ?? null,
            bookingStep: parsed.bookingStep ?? null,
            availableSlots: parsed.availableSlots ?? null,
            lastActivityTime: parsed.lastActivityTime ?? Date.now(),
          };
        }
      } catch (error) {
        console.error('Error loading booking state from localStorage:', error);
      }
    }
    return {
      bookingStatus: null,
      bookingStep: null,
      availableSlots: null,
      lastActivityTime: Date.now(),
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BOOKING_STATE_STORAGE_KEY, JSON.stringify(bookingState));
      } catch (error) {
        console.error('Error saving booking state to localStorage:', error);
      }
    }
  }, [bookingState]);

  const updateBookingState = useCallback((newState: Partial<BookingState>) => {
    setBookingState((prev) => ({
      ...prev,
      ...newState,
      lastActivityTime: Date.now(),
    }));
  }, []);

  const resetBookingState = useCallback(() => {
    setBookingState({
      bookingStatus: null,
      bookingStep: null,
      availableSlots: null,
      lastActivityTime: Date.now(),
    });
    // Also remove from localStorage to fully clear
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(BOOKING_STATE_STORAGE_KEY);
      } catch (error) {
        console.error('Error clearing booking state from localStorage:', error);
      }
    }
  }, []);

  // Check for timeout (30 minutes of inactivity)
  const checkTimeout = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - bookingState.lastActivityTime;
    const thirtyMinutes = 30 * 60 * 1000;

    if (bookingState.bookingStatus !== null && timeSinceLastActivity >= thirtyMinutes) {
      resetBookingState();
      return true;
    }
    return false;
  }, [bookingState.lastActivityTime, bookingState.bookingStatus, resetBookingState]);

  return {
    bookingState,
    updateBookingState,
    resetBookingState,
    checkTimeout,
  };
}
