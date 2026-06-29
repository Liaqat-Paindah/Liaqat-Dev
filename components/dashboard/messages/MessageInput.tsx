"use client";

import React, { useRef, useState } from "react";

export const MessageInput = ({
  conversationId,
  onSend,
  onTyping,
  sending = false,
}: {
  conversationId?: string;
  onSend: (text: string) => Promise<void>;
  onTyping?: (isTyping: boolean) => void;
  sending?: boolean;
}) => {
  const [text, setText] = useState("");
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || !conversationId || sending) return;

    try {
      await onSend(text.trim());
      setText("");
      onTyping?.(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={submit} className="p-3 border-t border-border bg-card">
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping?.(true);
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
            typingTimerRef.current = setTimeout(() => onTyping?.(false), 1200);
          }}
          placeholder="Write a message..."
          className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={sending || !conversationId || !text.trim()}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
