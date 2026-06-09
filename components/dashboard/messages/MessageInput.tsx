"use client";
import React, { useState } from "react";

export const MessageInput = ({ conversationId, onSend }: { conversationId: string; onSend: (text: string) => Promise<void> }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await onSend(text.trim());
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-3 border-t border-border bg-card">
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button type="submit" disabled={sending} className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
