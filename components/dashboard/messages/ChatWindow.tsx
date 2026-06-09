"use client";

import React, { useEffect, useRef } from "react";
import useMessages from "@/hooks/useMessages";
import { useConversation } from "@/hooks/useConversations";
import MessageInput from "./MessageInput";
import { useAuth } from "@/components/provider/authContext";

export const ChatWindow = ({ conversationId }: { conversationId?: string | null }) => {
  const { messages, loading, sendMessage, typingUsers, setTyping, isSending, error } = useMessages(conversationId || null);
  const { data: conversation } = useConversation(conversationId);
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages.length]);

  if (!conversationId) {
    return <div className="flex-1 p-6 flex items-center justify-center text-muted-foreground">Select a conversation to start chatting</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-background px-4 py-3">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold text-foreground">
            {conversation?.topic || conversation?.title || 'Chat Topic'}
          </div>
          <div className="text-xs text-muted-foreground">
            {conversation?.participants?.length
              ? `${conversation.participants.length} participant${conversation.participants.length > 1 ? 's' : ''}`
              : 'Chat history loaded from your topic'}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && <div className="text-sm text-muted-foreground">Loading messages...</div>}
        {error && <div className="text-sm text-destructive">Failed to load messages.</div>}
        {typingUsers.length > 0 && (
          <div className="text-sm text-muted-foreground">Someone is typing...</div>
        )}
        {!loading && messages.length === 0 && (
          <div className="text-sm text-muted-foreground">No messages yet. Start the conversation below.</div>
        )}
        {messages.map((m) => {
          const isSender = m.sender_id === user?.id;
          const senderName = isSender ? 'You' : `${m.sender?.first_name || m.sender?.email || 'Participant'}`;
          return (
            <div key={m.id} className={`max-w-xl ${isSender ? 'ml-auto text-right' : ''}`}>
              <div className="text-[11px] font-medium text-muted-foreground mb-1">{senderName}</div>
              <div className={`inline-block px-3 py-2 rounded-md ${isSender ? 'bg-primary text-primary-foreground' : 'bg-muted/20 text-foreground'}`}>
                <div className="text-sm">{m.body}</div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString()}</div>
                {isSender && (
                  <div className="mt-1 text-[10px] text-slate-500">
                    {m.read ? 'Read' : 'Delivered'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <MessageInput
        conversationId={conversationId}
        sending={isSending}
        onSend={async (text) => {
          await sendMessage(conversationId, text);
        }}
        onTyping={(isTyping) => setTyping(conversationId, isTyping)}
      />
    </div>
  );
};

export default ChatWindow;
