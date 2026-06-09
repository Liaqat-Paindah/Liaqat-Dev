"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase/supabase";

export const useMessages = (conversationId?: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!conversationId) return;

    let mounted = true;
    setLoading(true);

    // initial fetch
    fetch(`/api/messages/${conversationId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setMessages(data || []);
      })
      .finally(() => mounted && setLoading(false));

    // subscribe to realtime changes for this conversation
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((m) => [...m, payload.new]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((m) => m.map((msg) => (msg.id === payload.new.id ? payload.new : msg)));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      mounted = false;
      try {
        if (channelRef.current) supabase.removeChannel(channelRef.current);
      } catch {}
    };
  }, [conversationId]);

  const sendMessage = async (conversation_id: string, body: string, metadata?: any) => {
    const res = await fetch(`/api/messages/${conversation_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, metadata }),
    });

    if (!res.ok) throw new Error("Failed to send");
    const data = await res.json();
    return data;
  };

  const markRead = async (conversation_id: string) => {
    await fetch(`/api/messages/${conversation_id}`, {
      method: "PUT",
    });
  };

  return { messages, loading, sendMessage, markRead };
};

export default useMessages;
