/**
 * Custom hook for session management
 * Generates and persists sessionId in localStorage
 */

import { useState, useEffect, useCallback } from 'react';

const SESSION_STORAGE_KEY = 'vetChatbot_sessionId';

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  // Use UUID v4 format: timestamp + random string
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${randomStr}`;
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize or regenerate session ID
  const initializeSession = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Check for existing session in localStorage
    const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Generate new session ID
      const newSessionId = generateSessionId();
      localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    if (typeof window !== 'undefined' && sessionId) {
      // Store last activity time
      localStorage.setItem(`vetChatbot_lastActivity_${sessionId}`, Date.now().toString());
    }
  }, [sessionId]);

  // Get last activity time
  const getLastActivityTime = useCallback((): number => {
    if (typeof window === 'undefined' || !sessionId) {
      return Date.now();
    }
    const stored = localStorage.getItem(`vetChatbot_lastActivity_${sessionId}`);
    return stored ? parseInt(stored, 10) : Date.now();
  }, [sessionId]);

  // Clear session ID (new one will be generated when widget opens again)
  const clearSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Remove session ID from localStorage
      localStorage.removeItem(SESSION_STORAGE_KEY);
      // Also clear any activity timestamps for this session
      if (sessionId) {
        localStorage.removeItem(`vetChatbot_lastActivity_${sessionId}`);
      }
      // Reset session ID state - new one will be generated on next open
      setSessionId(null);
    }
  }, [sessionId]);

  return {
    sessionId,
    updateActivity,
    getLastActivityTime,
    clearSession,
    initializeSession,
  };
}
