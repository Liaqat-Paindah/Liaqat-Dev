"use client";

import { useConversations, useCreateConversation } from "@/hooks/useConversations";
import { useAuth } from "@/components/provider/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ConversationList = ({ activeId }: { activeId?: string | null }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { data: conversations = [], isLoading, isError } = useConversations();
  const createConversation = useCreateConversation();
  const [newTopic, setNewTopic] = useState("");
  const [showNewTopic, setShowNewTopic] = useState(false);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newTopic.trim()) return;

    try {
      const data = await createConversation.mutateAsync({
        participantIds: [user.id],
        topic: newTopic.trim(),
        title: newTopic.trim(),
      });
      setNewTopic("");
      setShowNewTopic(false);
      if (data?.id) {
        router.push(`/dashboard/messages?conversationId=${data.id}`);
      }
    } catch {
      // toast handled in hook
    }
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-semibold">Topics</h3>
        <p className="text-xs text-muted-foreground mt-1">
          All users can open any topic and join the conversation.
        </p>
        <button
          type="button"
          onClick={() => setShowNewTopic((value) => !value)}
          className="mt-3 w-full rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-accent/30"
        >
          {showNewTopic ? "Cancel" : "Start new topic"}
        </button>
        {showNewTopic && (
          <form onSubmit={handleCreateTopic} className="mt-2 flex gap-2">
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Topic name..."
              className="flex-1 rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={createConversation.isPending || !newTopic.trim()}
              className="rounded-md bg-primary px-2 py-1.5 text-xs text-primary-foreground disabled:opacity-50"
            >
              Add
            </button>
          </form>
        )}
      </div>

      <div className="divide-y flex-1">
        {isLoading && conversations.length === 0 && (
          <div className="p-3 text-sm text-muted-foreground">Loading topics...</div>
        )}
        {isError && <div className="p-3 text-sm text-destructive">Failed to load topics.</div>}
        {!isLoading && !isError && conversations.length === 0 && (
          <div className="p-3 text-sm text-muted-foreground">
            No topics yet. Start one above or open a job from Applications.
          </div>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => router.push(`/dashboard/messages?conversationId=${c.id}`)}
            className={`w-full text-left p-3 hover:bg-accent/30 flex items-center gap-3 ${activeId === c.id ? "bg-primary/5" : ""}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.02em]">
                  {c.topic || c.title || "General"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {c.lastMessage?.created_at
                    ? new Date(c.lastMessage.created_at).toLocaleString()
                    : "No messages yet"}
                </span>
              </div>
              <div className="text-sm font-medium truncate">{c.title || c.topic || "Conversation"}</div>
              <div className="text-xs text-muted-foreground truncate mt-1">
                {c.lastMessage?.body || "Open the topic to view chat history"}
              </div>
            </div>
            {c.unread > 0 && (
              <div className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs px-2 py-0.5">
                {c.unread}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
