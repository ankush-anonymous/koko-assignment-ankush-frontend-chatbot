/**
 * Custom hook for handling keyboard shortcuts in chat input
 */

import { KeyboardEvent, useCallback } from 'react';

interface UseKeyboardShortcutsOptions {
  onSend: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions) {
  const { onSend, disabled = false } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (disabled) return;

      // Enter to send (if not empty)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
      // Shift+Enter allows newline (default behavior)
    },
    [onSend, disabled]
  );

  return {
    handleKeyDown,
  };
}
