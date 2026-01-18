# Chatbot Widget Implementation Plan

## Summary

1. Floating button (default state)
   - Bottom-right floating icon/button
   - Always visible
   - ✅ **COMPLETED**: ChatButton.tsx component created

2. Chat panel expansion
   - Clicking the button opens a chat panel
   - Drawer/modal style, anchored to the button
   - Smooth CSS transitions, no layout shift
   - ✅ **COMPLETED**: ChatPanel.tsx component created

3. Three toggle states
   - Closed: only button visible
   - Open: full chat panel
   - Minimized: collapsed state (header visible)
   - ✅ **COMPLETED**: Three-state system implemented in ChatPanel

4. Chat UI components
   - Header: bot name, close/minimize buttons
   - Scrollable message area
   - Fixed input box at bottom with send button
   - ✅ **COMPLETED**: All UI components created (ChatHeader, MessageList, MessageItem, ChatInput)

5. State management
   - Messages persist across route navigation
   - Auto-scroll to latest message on new messages
   - Preserve scroll position when loading message history
   - ✅ **COMPLETED**: useChatState hook with localStorage persistence, useAutoScroll hook

6. Interaction behavior
   - No global overlay blocking the page
   - Only the chat panel area blocks interaction (if needed)
   - Background remains interactive
   - ✅ **COMPLETED**: No overlay, background remains interactive

7. Mobile responsiveness
   - Mobile: full-height bottom sheet
   - Desktop: anchored drawer/modal
   - ⚠️ **IN PROGRESS**: Basic styles added, needs mobile refinement

8. Keyboard shortcuts
   - Enter: send message
   - Shift+Enter: newline in input
   - ✅ **COMPLETED**: useKeyboardShortcuts hook implemented

9. Hosting/embedding
   - Should be embeddable/callable by any application (likely a widget/component)
   - ✅ **COMPLETED**: Main widget component created, needs example page

## Implementation Status

### ✅ Completed Components
- `components/ChatbotWidget/types.ts` - TypeScript interfaces
- `components/ChatbotWidget/index.tsx` - Main widget component
- `components/ChatbotWidget/ChatButton.tsx` - Floating button
- `components/ChatbotWidget/ChatPanel.tsx` - Chat panel with three states
- `components/ChatbotWidget/ChatHeader.tsx` - Header component
- `components/ChatbotWidget/MessageList.tsx` - Message list with auto-scroll
- `components/ChatbotWidget/MessageItem.tsx` - Individual message component
- `components/ChatbotWidget/ChatInput.tsx` - Input with keyboard shortcuts
- `components/ChatbotWidget/hooks/useChatState.ts` - State management
- `components/ChatbotWidget/hooks/useAutoScroll.ts` - Auto-scroll logic
- `components/ChatbotWidget/hooks/useKeyboardShortcuts.ts` - Keyboard handling
- `components/ChatbotWidget/hooks/useChatAPI.ts` - API integration
- `components/ChatbotWidget/styles.css` - Custom animations

### ⚠️ Needs Refinement
- Mobile responsive styles (full-height bottom sheet)
- Animation polish and testing
- Example integration page

### 📋 Next Steps
1. Refine mobile responsiveness
2. Create example page for testing
3. Test all features and polish animations





Solution 3: Hybrid approach (best)
Combine both:
Backend: Add bookingTimeout flag in response
Frontend: Track inactivity and show proactive warnings
Frontend: Handle timeout flag from backend
Backend changes:
// In handleChat functionlet bookingTimeoutDetected = false;// Check for booking timeoutif (session && (session.booking_status === 'initiated' || session.booking_status === 'pending')) {  const now = Date.now();  const lastActivity = new Date(session.lastActivityAt).getTime();  const timeSinceLastActivity = now - lastActivity;  if (timeSinceLastActivity > BOOKING_TIMEOUT_MS) {    bookingTimeoutDetected = true;    // Reset booking state...    session.booking_status = null;    session.booking_step = null;    // ... rest of reset    await session.save();        // Prepend timeout message to bot response    if (bookingTimeoutDetected) {      botResponse = "⚠️ Your booking session expired due to inactivity. " + botResponse;    }  }}// Return responseres.status(200).json({  success: true,  message: botResponse,  bookingStatus: bookingStatus,  bookingStep: bookingStep,  availableSlots: availableSlots,  bookingTimeout: bookingTimeoutDetected, // Frontend can use this});
Frontend implementation:
// Frontend timeout managementclass BookingTimeoutManager {  constructor() {    this.lastActivityTime = Date.now();    this.timeoutWarningShown = false;    this.BOOKING_TIMEOUT_MS = 30 * 60 * 1000;    this.WARNING_TIME_MS = 25 * 60 * 1000;    this.startMonitoring();  }  updateActivity() {    this.lastActivityTime = Date.now();    this.timeoutWarningShown = false;  }  startMonitoring() {    setInterval(() => {      const timeSinceActivity = Date.now() - this.lastActivityTime;            // Show warning at 25 minutes      if (timeSinceActivity > this.WARNING_TIME_MS && !this.timeoutWarningShown) {        if (this.isInBookingFlow()) {          this.showWarning("⚠️ Your booking session will expire in 5 minutes due to inactivity.");          this.timeoutWarningShown = true;        }      }    }, 60000); // Check every minute  }  isInBookingFlow() {    // Check if current bookingStatus is not null    return this.currentBookingStatus !== null;  }  handleBackendTimeout(response) {    // Handle timeout flag from backend    if (response.bookingTimeout) {      this.showMessage("Your booking session has expired.");      this.resetBookingState();    }  }}
