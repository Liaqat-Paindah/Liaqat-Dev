"use client";
import React, { useEffect, useRef, useState } from "react";
import useMessages from "@/hooks/useMessages";
import MessageInput from "./MessageInput";
import { useAuth } from "@/components/provider/authContext";

export const ChatWindow = ({ conversationId }: { conversationId?: string | null }) => {
  const { messages, loading, sendMessage, markRead } = useMessages(conversationId || null);
  const { user } = useAuth();
  const [conversation, setConversation] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    markRead(conversationId).catch(() => {});
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) {
      setConversation(null);
      return;
    }

    fetch(`/api/conversations/${conversationId}`)
      .then((res) => res.json())
      .then((data) => setConversation(data || null))
      .catch(() => setConversation(null));
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [Array.isArray(messages) ? messages.length : 0]);

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
        {loading && <div>Loading...</div>}
        {Array.isArray(messages) ? (
          messages.map((m) => {
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
          })
        ) : (
          <div className="text-sm text-muted-foreground">No messages yet.</div>
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput conversationId={conversationId} onSend={async (text) => await sendMessage(conversationId!, text)} />
    </div>
  );
};

export default ChatWindow;
