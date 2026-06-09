"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import ConversationList from "@/components/dashboard/messages/ConversationList";
import ChatWindow from "@/components/dashboard/messages/ChatWindow";

export default function MessagesPage() {
  const params = useSearchParams();
  const conversationId = params?.get("conversationId");

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
