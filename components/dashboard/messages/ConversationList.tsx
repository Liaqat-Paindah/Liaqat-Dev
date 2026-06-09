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
        <h3 className="text-sm font-semibold">Conversations</h3>
      </div>
      <div className="divide-y">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => router.push(`/dashboard/messages?conversationId=${c.id}`)}
            className={`w-full text-left p-3 hover:bg-accent/30 flex items-center gap-3 ${activeId === c.id ? 'bg-primary/5' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="truncate text-sm font-medium">{c.title || `Conversation`}</div>
                <div className="text-xs text-muted-foreground">{c.lastMessage?.created_at ? new Date(c.lastMessage.created_at).toLocaleString() : ''}</div>
              </div>
              <div className="text-xs text-muted-foreground truncate mt-1">{c.lastMessage?.body}</div>
            </div>
            {c.unread > 0 && <div className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs px-2 py-0.5">{c.unread}</div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
