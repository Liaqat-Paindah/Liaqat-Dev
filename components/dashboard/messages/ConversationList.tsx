"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const ConversationList = ({ activeId }: { activeId?: string | null }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/conversations')
      .then((r) => r.json())
      .then((data) => setConversations(data || []));
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3">
        <h3 className="text-sm font-semibold">Topics</h3>
        <p className="text-xs text-muted-foreground mt-1">Open any topic to continue your conversation.</p>
      </div>
      <div className="divide-y">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => router.push(`/dashboard/messages?conversationId=${c.id}`)}
            className={`w-full text-left p-3 hover:bg-accent/30 flex items-center gap-3 ${activeId === c.id ? 'bg-primary/5' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.02em]">
                  {c.topic || c.title || 'General'}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {c.lastMessage?.created_at ? new Date(c.lastMessage.created_at).toLocaleString() : 'No messages yet'}
                </span>
              </div>
              <div className="text-sm font-medium truncate">{c.title || c.topic || 'Conversation'}</div>
              <div className="text-xs text-muted-foreground truncate mt-1">{c.lastMessage?.body || 'Open the topic to view chat history'}</div>
            </div>
            {c.unread > 0 && <div className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs px-2 py-0.5">{c.unread}</div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
