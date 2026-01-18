/**
 * Special Input Components for Booking Flow
 * Date picker, slot selection, and confirmation buttons
 */

import React, { useState } from 'react';
import { BookingStep, TimeSlot } from './types';

interface BookingInputsProps {
  bookingStep: BookingStep;
  availableSlots: TimeSlot[] | null;
  onSelect: (value: string) => void;
}

export default function BookingInputs({
  bookingStep,
  availableSlots,
  onSelect,
}: BookingInputsProps) {
  const [selectedDate, setSelectedDate] = useState('');

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time slot for display
  const formatTimeSlot = (slot: TimeSlot): string => {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);
    const startTime = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const endTime = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${startTime} - ${endTime}`;
  };

  // Group slots by date
  const groupSlotsByDate = (slots: TimeSlot[]): Map<string, TimeSlot[]> => {
    const grouped = new Map<string, TimeSlot[]>();
    let globalIndex = 0;

    slots.forEach((slot) => {
      // Use date field if available, otherwise extract from startTime
      const dateKey = slot.date || new Date(slot.startTime).toISOString().split('T')[0];
      
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push({ ...slot, date: dateKey });
    });

    return grouped;
  };

  // Handle date selection
  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date) {
      // Format as YYYY-MM-DD
      onSelect(date);
    }
  };

  // Handle slot selection
  const handleSlotSelect = (slotId: string, allSlots: TimeSlot[]) => {
    // Find the index of the selected slot in the original array
    const slotIndex = allSlots.findIndex((slot) => slot.id === slotId);
    if (slotIndex !== -1) {
      onSelect((slotIndex + 1).toString());
    }
  };

  // Handle confirmation
  const handleConfirmation = (value: 'yes' | 'no') => {
    onSelect(value);
  };

  if (bookingStep === 'ASK_DATE') {
    // Get tomorrow's date as minimum (can't book in the past)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
      <div className="mt-2">
        <input
          type="date"
          min={minDate}
          value={selectedDate}
          onChange={handleDateSelect}
          className="
            w-full
            px-4 py-2
            border border-gray-300 rounded-lg
            text-black
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
          "
        />
        <p className="text-xs text-gray-500 mt-1">
          Or type the date in YYYY-MM-DD format (e.g., 2024-12-25)
        </p>
      </div>
    );
  }

  if (bookingStep === 'SHOW_SLOTS' && availableSlots && availableSlots.length > 0) {
    const groupedSlots = groupSlotsByDate(availableSlots);
    const sortedDates = Array.from(groupedSlots.keys()).sort();

    return (
      <div className="mt-2">
        <p className="text-sm text-gray-600 mb-2">Select a time slot:</p>
        <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
          {sortedDates.map((dateKey) => {
            const slotsForDate = groupedSlots.get(dateKey) || [];
            return (
              <div key={dateKey} className="space-y-2">
                <h4 className="text-sm font-semibold text-black mb-2 sticky top-0 bg-white py-1">
                  {formatDate(dateKey)}
                </h4>
                <div className="space-y-2">
                  {slotsForDate.map((slot) => {
                    const slotIndex = availableSlots.findIndex((s) => s.id === slot.id);
                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot.id, availableSlots)}
                        className="
                          w-full
                          px-4 py-3
                          bg-gray-100 hover:bg-gray-200
                          border border-gray-300 rounded-lg
                          text-black text-left
                          transition-colors
                          focus:outline-none focus:ring-2 focus:ring-gray-500
                        "
                      >
                        {slotIndex !== -1 && `${slotIndex + 1}. `}
                        {formatTimeSlot(slot)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Or type the slot number (1, 2, 3, etc.)
        </p>
      </div>
    );
  }

  if (bookingStep === 'CONFIRM_SLOT') {
    return (
      <div className="mt-2">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => handleConfirmation('yes')}
            className="
              flex-1
              px-4 py-2
              bg-black hover:bg-gray-800
              text-white
              rounded-lg
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-gray-500
            "
          >
            Yes
          </button>
          <button
            onClick={() => handleConfirmation('no')}
            className="
              flex-1
              px-4 py-2
              bg-gray-200 hover:bg-gray-300
              text-black
              rounded-lg
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-gray-500
            "
          >
            No
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Or type &quot;yes&quot; or &quot;no&quot;
        </p>
      </div>
    );
  }

  // For other steps (ASK_EMAIL, ASK_OWNER_NAME, ASK_PET_NAME, ASK_PHONE)
  // Show input hints if needed
  if (bookingStep === 'ASK_EMAIL') {
    return (
      <p className="text-xs text-gray-500 mt-1">
        Enter your email address
      </p>
    );
  }

  if (bookingStep === 'ASK_PHONE') {
    return (
      <p className="text-xs text-gray-500 mt-1">
        Enter your phone number
      </p>
    );
  }

  return null;
}
