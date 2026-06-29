"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConversationList from "@/components/dashboard/messages/ConversationList";
import ChatWindow from "@/components/dashboard/messages/ChatWindow";
import { useAuth } from "@/components/provider/authContext";
import { useConversations } from "@/hooks/useConversations";
import Link from "next/link";

export default function MessagesPage() {
  const params = useSearchParams();
  const router = useRouter();
  const conversationId = params?.get("conversationId");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: conversations = [], isLoading } = useConversations();

  useEffect(() => {
    if (authLoading || isLoading || conversationId || !conversations.length) return;
    router.replace(`/dashboard/messages?conversationId=${conversations[0].id}`);
  }, [authLoading, isLoading, conversationId, conversations, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background pt-10 flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pt-10 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Please log in to view topics and send messages.</p>
        <Link href="/login" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-10">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[72vh]">
          <div className="lg:col-span-1 bg-card border border-border rounded-sm overflow-hidden">
            <ConversationList activeId={conversationId} />
          </div>
          <div className="lg:col-span-3 bg-card border border-border rounded-sm overflow-hidden flex flex-col">
            <ChatWindow conversationId={conversationId} />
          </div>
        </div>
      </div>
    </div>
  );
}
