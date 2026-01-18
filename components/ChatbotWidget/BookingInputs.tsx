/**
 * Special Input Components for Booking Flow
 * Date picker, slot selection, and confirmation buttons
 * Uses inline styles for standalone bundle compatibility
 */

import React, { useState } from 'react';
import { BookingStep, TimeSlot } from './types';

interface BookingInputsProps {
  bookingStep: BookingStep;
  availableSlots: TimeSlot[] | null;
  onSelect: (value: string) => void;
}

// Common styles
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 16px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  color: '#000000',
  fontSize: '14px',
  outline: 'none',
};

const hintStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '4px',
};

const slotButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  color: '#000000',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  fontSize: '14px',
};

const confirmButtonBaseStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  fontSize: '14px',
  fontWeight: 500,
};

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
      <div style={{ marginTop: '8px' }}>
        <input
          type="date"
          min={minDate}
          value={selectedDate}
          onChange={handleDateSelect}
          style={inputStyle}
        />
        <p style={hintStyle}>
          Or type the date in YYYY-MM-DD format (e.g., 2024-12-25)
        </p>
      </div>
    );
  }

  if (bookingStep === 'SHOW_SLOTS' && availableSlots && availableSlots.length > 0) {
    const groupedSlots = groupSlotsByDate(availableSlots);
    const sortedDates = Array.from(groupedSlots.keys()).sort();

    return (
      <div style={{ marginTop: '8px' }}>
        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>Select a time slot:</p>
        <div style={{ maxHeight: '256px', overflowY: 'auto', paddingRight: '8px' }}>
          {sortedDates.map((dateKey) => {
            const slotsForDate = groupedSlots.get(dateKey) || [];
            return (
              <div key={dateKey} style={{ marginBottom: '16px' }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#000000', 
                  marginBottom: '8px',
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#ffffff',
                  padding: '4px 0',
                }}>
                  {formatDate(dateKey)}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {slotsForDate.map((slot) => {
                    const slotIndex = availableSlots.findIndex((s) => s.id === slot.id);
                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot.id, availableSlots)}
                        style={slotButtonStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
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
        <p style={hintStyle}>
          Or type the slot number (1, 2, 3, etc.)
        </p>
      </div>
    );
  }

  if (bookingStep === 'CONFIRM_SLOT') {
    return (
      <div style={{ marginTop: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            onClick={() => handleConfirmation('yes')}
            style={{ ...confirmButtonBaseStyle, backgroundColor: '#000000', color: '#ffffff' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
          >
            Yes
          </button>
          <button
            onClick={() => handleConfirmation('no')}
            style={{ ...confirmButtonBaseStyle, backgroundColor: '#e5e7eb', color: '#000000' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
          >
            No
          </button>
        </div>
        <p style={hintStyle}>
          Or type &quot;yes&quot; or &quot;no&quot;
        </p>
      </div>
    );
  }

  // For other steps (ASK_EMAIL, ASK_OWNER_NAME, ASK_PET_NAME, ASK_PHONE)
  // Show input hints if needed
  if (bookingStep === 'ASK_EMAIL') {
    return (
      <p style={{ ...hintStyle, marginTop: '4px' }}>
        Enter your email address
      </p>
    );
  }

  if (bookingStep === 'ASK_PHONE') {
    return (
      <p style={{ ...hintStyle, marginTop: '4px' }}>
        Enter your phone number
      </p>
    );
  }

  return null;
}
