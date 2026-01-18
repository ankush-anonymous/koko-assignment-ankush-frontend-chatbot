# Frontend Implementation Guide - Veterinary Chatbot SDK

## Overview

This document outlines the logic and implementation requirements for the frontend chatbot widget that integrates with the backend `/chat` API endpoint.

---

## API Endpoint

### Chat Endpoint
- **URL**: `POST /api/v1/chat`
- **Base URL**: Configure via environment variable or config
- **Content-Type**: `application/json`

---

## Request Format

### Request Body Structure
Every chat message must be sent with the following structure:

```json
{
  "sessionId": "string (required)",
  "userMessage": "string (required)"
}
```

### Request Fields

1. **sessionId** (string, required)
   - Unique identifier for the user's session
   - Must be consistent across all messages from the same user/device
   - Should be stored in browser localStorage
   - Format: Any string (e.g., UUID, timestamp-based ID, or custom format)
   - Generation: Create once on widget initialization, reuse for all subsequent messages

2. **userMessage** (string, required)
   - The user's input message
   - Should be trimmed before sending
   - Can be any text input from the user

---

## Response Format

### Success Response Structure
```json
{
  "success": true,
  "message": "string (bot's response text)",
  "bookingStatus": "string | null",
  "bookingStep": "string | null",
  "availableSlots": "array | null"
}
```

### Response Fields

1. **success** (boolean)
   - Always `true` for successful requests
   - Use this to verify successful API call

2. **message** (string)
   - The bot's response text to display in the chat UI
   - Always present in successful responses
   - May contain timeout messages (e.g., "⚠️ Your booking session expired...")

3. **bookingStatus** (string | null)
   - Possible values:
     - `null` - Not in booking flow (normal chat mode)
     - `"initiated"` - Booking flow just started
     - `"pending"` - Booking flow in progress
     - `"completed"` - Booking completed (should not appear, as status resets to null after completion)
   - Use this to determine if user is in booking flow
   - When `null`, treat as normal veterinary Q&A mode

4. **bookingStep** (string | null)
   - Only relevant when `bookingStatus` is not `null`
   - Possible values:
     - `null` - Not in booking flow
     - `"ASK_EMAIL"` - Waiting for user's email address
     - `"ASK_OWNER_NAME"` - Waiting for pet owner's name
     - `"ASK_PET_NAME"` - Waiting for pet's name
     - `"ASK_PHONE"` - Waiting for phone number
     - `"ASK_DATE"` - Waiting for preferred date
     - `"SHOW_SLOTS"` - Showing available time slots, waiting for slot selection
     - `"CONFIRM_SLOT"` - Waiting for confirmation (yes/no) on selected slot
   - Use this to customize UI behavior (e.g., show date picker for ASK_DATE, show slot buttons for SHOW_SLOTS)

5. **availableSlots** (array | null)
   - Only populated when `bookingStep === "SHOW_SLOTS"`
   - Structure when present:
     ```json
     [
       {
         "id": "string (TimeSlot ObjectId)",
         "startTime": "ISO 8601 date string",
         "endTime": "ISO 8601 date string"
       }
     ]
     ```
   - Use this to display selectable time slots in the UI
   - When `null`, ignore this field

### Error Response Structure
```json
{
  "success": false,
  "error": "string (error type)",
  "details": "string (error message)"
}
```

---

## Session Management Logic

### Session ID Generation and Storage

1. **Initial Session Creation**
   - On widget initialization, check localStorage for existing `sessionId`
   - If not found, generate a new unique session ID
   - Store in localStorage with key: `vetChatbot_sessionId`
   - Format suggestion: UUID v4 or `session_${timestamp}_${randomString}`

2. **Session Persistence**
   - Always use the same `sessionId` for all messages from the same browser/device
   - Session persists across page reloads (via localStorage)
   - Session persists across browser tabs (same localStorage = same session)

3. **Session Lifecycle**
   - Session never expires on frontend (backend handles timeout)
   - Same session can be used for multiple bookings
   - Session accumulates conversation history automatically

### Session ID Format Examples
- UUID: `"550e8400-e29b-41d4-a716-446655440000"`
- Timestamp-based: `"session_1703123456789_abc123"`
- Custom: `"user_device_12345"`

---

## Booking State Management

### State Flow Understanding

The frontend should track and respond to booking states:

1. **Normal Chat Mode** (`bookingStatus === null`)
   - User is in general veterinary Q&A mode
   - Display messages normally
   - No special UI components needed

2. **Booking Initiated** (`bookingStatus === "initiated"`)
   - User confirmed they want to book an appointment
   - Booking flow just started
   - Next step will be `ASK_EMAIL`

3. **Booking Pending** (`bookingStatus === "pending"`)
   - User is actively in booking flow
   - Check `bookingStep` to determine what input is expected
   - May need to show specialized UI components

### Booking Step UI Behavior

Based on `bookingStep`, implement appropriate UI:

1. **ASK_EMAIL**
   - Normal text input
   - Optionally: Show email input field with validation hint
   - Display bot message asking for email

2. **ASK_OWNER_NAME**
   - Normal text input
   - Display bot message asking for owner's name

3. **ASK_PET_NAME**
   - Normal text input
   - Display bot message asking for pet's name

4. **ASK_PHONE**
   - Normal text input
   - Optionally: Show phone input field with format hint
   - Display bot message asking for phone number

5. **ASK_DATE**
   - Normal text input (user can type date)
   - Recommended: Show date picker component
   - Display bot message asking for preferred date
   - Format hint: "YYYY-MM-DD" (e.g., "2024-12-25")

6. **SHOW_SLOTS**
   - Display `availableSlots` array as selectable buttons/cards
   - Each slot should show: time range (e.g., "10:00 AM - 10:30 AM")
   - User selects by clicking a slot or typing slot number
   - Display bot message with numbered list of slots

7. **CONFIRM_SLOT**
   - Normal text input (expecting yes/no)
   - Optionally: Show yes/no buttons
   - Display bot message asking for confirmation

---

## Timeout Management

### Backend Timeout Behavior

- Backend automatically resets booking state after 30 minutes of inactivity
- When timeout occurs, backend sets `bookingStatus` and `bookingStep` to `null`
- Backend prepends timeout message to bot response: "⚠️ Your booking session expired due to inactivity."

### Frontend Timeout Logic

1. **Detect Timeout from Response**
   - Check if `message` contains timeout indicator
   - Check if `bookingStatus` changed from non-null to `null` unexpectedly
   - Reset frontend booking state when timeout detected

2. **Proactive Timeout Warning (Optional Enhancement)**
   - Track last user activity timestamp
   - If in booking flow (`bookingStatus !== null`), monitor inactivity
   - At 25 minutes of inactivity, show warning: "⚠️ Your booking session will expire in 5 minutes due to inactivity."
   - At 30 minutes, automatically reset booking state on frontend
   - Update activity timestamp on every user message sent

3. **Activity Tracking**
   - Update activity timestamp when:
     - User sends a message
     - User interacts with chat widget (opens/closes)
   - Store last activity in component state or localStorage

---

## Message Flow Logic

### Sending Messages

1. **User Input Handling**
   - Capture user input from text field or specialized input (date picker, slot selection)
   - Trim whitespace from input
   - Validate required fields if using specialized inputs (optional, backend validates)
   - Format input appropriately:
     - Date: Convert to "YYYY-MM-DD" format if using date picker
     - Slot selection: Send slot number (e.g., "1", "2") or slot ID

2. **API Request**
   - Show loading indicator in chat UI
   - Send POST request to `/api/v1/chat` with `{ sessionId, userMessage }`
   - Handle network errors gracefully
   - Handle API errors (check `success === false`)

3. **Response Handling**
   - Parse response JSON
   - Check `success === true`
   - Extract `message`, `bookingStatus`, `bookingStep`, `availableSlots`
   - Update frontend state with booking information
   - Display bot message in chat UI
   - Update UI components based on `bookingStep` (show date picker, slot buttons, etc.)

4. **Error Handling**
   - Network errors: Show "Failed to send message. Please try again."
   - API errors: Display error message from `details` field
   - Timeout errors: Handle gracefully, allow retry

---

## UI State Management

### State Variables to Maintain

1. **Session State**
   - `sessionId`: Current session identifier (from localStorage)
   - `lastActivityTime`: Timestamp of last user activity

2. **Booking State**
   - `bookingStatus`: Current booking status (from API response)
   - `bookingStep`: Current booking step (from API response)
   - `availableSlots`: Array of available slots (from API response, only when SHOW_SLOTS)

3. **Chat State**
   - `messages`: Array of chat messages (user + bot)
   - `isLoading`: Boolean for loading indicator
   - `error`: Error message if any

### State Updates

- Update `bookingStatus` and `bookingStep` from every API response
- Update `availableSlots` only when `bookingStep === "SHOW_SLOTS"`
- Clear `availableSlots` when booking step changes
- Reset booking state when `bookingStatus === null` and `bookingStep === null`

---

## Special Input Handling

### Date Input (ASK_DATE step)

- **Option 1**: Text input with format hint
  - User types: "2024-12-25" or "December 25, 2024"
  - Backend handles parsing

- **Option 2**: Date picker component (recommended)
  - Show calendar/date picker UI
  - Format selected date as "YYYY-MM-DD" before sending
  - Disable past dates in picker
  - Send formatted date string as `userMessage`

### Slot Selection (SHOW_SLOTS step)

- **Option 1**: Text input
  - User types slot number: "1", "2", "3", etc.
  - Backend parses and validates

- **Option 2**: Button/card selection (recommended)
  - Display each slot from `availableSlots` as a clickable button/card
  - Show time range: "10:00 AM - 10:30 AM"
  - On click, send slot number (index + 1) as `userMessage`
  - Highlight selected slot visually

### Confirmation (CONFIRM_SLOT step)

- **Option 1**: Text input
  - User types: "yes", "no", "y", "n", etc.
  - Backend handles parsing

- **Option 2**: Yes/No buttons (recommended)
  - Show "Yes" and "No" buttons
  - On click, send "yes" or "no" as `userMessage`

---

## Error Handling Logic

### Network Errors
- Show user-friendly error message
- Allow retry mechanism
- Don't clear user's input
- Maintain current booking state

### API Errors
- Check `success === false` in response
- Display `error` and `details` fields to user
- Handle specific error types:
  - Validation errors: Show helpful message
  - Server errors: Show generic "Something went wrong" message

### Timeout Errors
- Detect timeout from response message
- Reset booking state
- Show timeout notification
- Allow user to start new booking

---

## Chat History Management

### Message Storage

1. **Local Storage (Optional)**
   - Store chat messages in localStorage for persistence
   - Key: `vetChatbot_messages_${sessionId}`
   - Load on widget initialization
   - Append new messages as they arrive

2. **In-Memory State (Required)**
   - Maintain messages array in component state
   - Append user message before API call
   - Append bot message after API response

### Message Display

- Display messages in chronological order
- Distinguish user messages vs bot messages visually
- Show timestamps (optional)
- Auto-scroll to latest message
- Handle long messages with text wrapping

---

## Widget Initialization Logic

### On Widget Load

1. **Check for Existing Session**
   - Read `sessionId` from localStorage
   - If exists, use it
   - If not, generate new `sessionId` and store it

2. **Load Chat History (Optional)**
   - Load previous messages from localStorage if stored
   - Display in chat UI

3. **Initialize State**
   - Set `bookingStatus = null`
   - Set `bookingStep = null`
   - Set `availableSlots = null`
   - Set `lastActivityTime = Date.now()`

4. **Show Welcome Message (Optional)**
   - Display initial bot greeting
   - Or wait for user's first message

---

## Integration with SDK Config

### Context Configuration (Optional)

If SDK supports context configuration:

```javascript
window.VetChatbotConfig = {
  userId: "user_123",
  userName: "John Doe",
  petName: "Buddy",
  source: "marketing-website"
};
```

### Handling Context

- Context is optional
- If provided, send to backend on first message (backend stores in session)
- Don't require context for widget to function
- Context helps backend personalize responses

---

## Best Practices

1. **Session Management**
   - Always use consistent `sessionId` per browser/device
   - Store in localStorage for persistence
   - Never regenerate `sessionId` unless user explicitly clears data

2. **State Synchronization**
   - Always update frontend state from API response
   - Don't assume state transitions
   - Backend is source of truth for booking state

3. **User Experience**
   - Show loading indicators during API calls
   - Provide clear feedback for each booking step
   - Handle errors gracefully
   - Allow user to cancel/abandon booking flow

4. **Performance**
   - Debounce rapid user inputs if needed
   - Cache session ID to avoid repeated localStorage reads
   - Optimize re-renders based on state changes

5. **Accessibility**
   - Ensure keyboard navigation works
   - Provide ARIA labels for specialized inputs
   - Support screen readers
   - Maintain focus management

---

## Testing Scenarios

### Test Cases to Implement

1. **Normal Chat Flow**
   - Send general veterinary questions
   - Verify responses and booking status remains null

2. **Booking Flow**
   - Start booking, complete all steps
   - Verify state transitions match booking steps
   - Verify slot selection works
   - Verify confirmation works

3. **Session Persistence**
   - Reload page during booking
   - Verify session continues with same sessionId
   - Verify booking state is maintained

4. **Timeout Handling**
   - Simulate 30+ minutes of inactivity
   - Verify booking state resets
   - Verify timeout message displays

5. **Error Handling**
   - Test network failures
   - Test API errors
   - Verify error messages display correctly

6. **Multiple Bookings**
   - Complete one booking
   - Start another booking in same session
   - Verify state resets correctly between bookings

---

## Summary

The frontend should:
1. Generate and persist a `sessionId` in localStorage
2. Send all messages to `POST /api/v1/chat` with `{ sessionId, userMessage }`
3. Parse response to get `message`, `bookingStatus`, `bookingStep`, `availableSlots`
4. Update UI based on booking state and step
5. Handle timeouts and errors gracefully
6. Provide appropriate input components for each booking step
7. Maintain chat history and state synchronization

The backend handles all business logic, validation, and state management. The frontend's role is to provide a smooth user interface and communicate with the backend API.
