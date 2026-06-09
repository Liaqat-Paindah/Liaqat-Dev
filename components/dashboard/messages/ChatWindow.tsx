"use client";
import React, { useEffect, useRef } from "react";
import useMessages from "@/hooks/useMessages";
import MessageInput from "./MessageInput";
import { useAuth } from "@/components/provider/authContext";

export const ChatWindow = ({ conversationId }: { conversationId?: string | null }) => {
  const { messages, loading, sendMessage, markRead } = useMessages(conversationId || null);
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    markRead(conversationId).catch(() => {});
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages.length]);

  if (!conversationId) {
    return <div className="flex-1 p-6 flex items-center justify-center text-muted-foreground">Select a conversation to start chatting</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && <div>Loading...</div>}
        {messages.map((m) => (
          <div key={m.id} className={`max-w-xl ${m.sender_id === user?.id ? 'ml-auto text-right' : ''}`}>
            <div className={`inline-block px-3 py-2 rounded-md ${m.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted/20 text-foreground'}`}>
              <div className="text-sm">{m.body}</div>
              <div className="text-xs text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput conversationId={conversationId} onSend={async (text) => await sendMessage(conversationId!, text)} />
    </div>
  );
};

export default ChatWindow;
