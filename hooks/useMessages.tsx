'use client';

import { clearConversationUnread, patchConversationListLastMessage } from '@/lib/messaging/cache';
import type { Message } from '@/type/messaging';
import { supabase } from '@/utils/supabase/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { messageKeys } from '@/lib/messaging/keys';
import { toast } from 'sonner';

export const useMessages = (conversationId?: string | null) => {
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const markedReadRef = useRef<string | null>(null);

  const messagesQuery = useQuery({
    queryKey: messageKeys.byConversation(conversationId || ''),
    queryFn: async () => {
      const response = await axios.get<Message[]>(`/api/messages/${conversationId}`);
      return response.data;
    },
    enabled: Boolean(conversationId),
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (!conversationId) {
      setTypingUsers([]);
      markedReadRef.current = null;
      return;
    }

    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const incoming = payload.new as Message;
          queryClient.setQueryData<Message[]>(messageKeys.byConversation(conversationId), (current = []) => {
            if (current.some((message) => message.id === incoming.id)) return current;
            return [...current, incoming];
          });
          patchConversationListLastMessage(queryClient, conversationId, incoming);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const updated = payload.new as Message;
          queryClient.setQueryData<Message[]>(messageKeys.byConversation(conversationId), (current = []) =>
            current.map((message) => (message.id === updated.id ? { ...message, ...updated } : message))
          );
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'typing_status', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const newStatus = payload.new as { user_id?: string; is_typing?: boolean } | null;
          if (!newStatus?.user_id) return;
          setTypingUsers((prev) => {
            const ids = new Set(prev);
            if (newStatus.is_typing) ids.add(newStatus.user_id!);
            else ids.delete(newStatus.user_id!);
            return Array.from(ids);
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, queryClient]);

  useEffect(() => {
    if (!conversationId || markedReadRef.current === conversationId) return;
    if (!messagesQuery.isSuccess) return;

    markedReadRef.current = conversationId;

    axios
      .put(`/api/messages/${conversationId}`)
      .then(() => clearConversationUnread(queryClient, conversationId))
      .catch(() => {
        markedReadRef.current = null;
      });
  }, [conversationId, queryClient, messagesQuery.isSuccess]);

  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    async (_conversation_id: string, body: string, metadata?: Record<string, unknown>) => {
      if (!conversationId) throw new Error('Missing conversation id');

      setIsSending(true);
      try {
        const response = await axios.post<Message>(`/api/messages/${conversationId}`, {
          conversation_id: conversationId,
          body,
          metadata,
        });
        const savedMessage = response.data;

        queryClient.setQueryData<Message[]>(messageKeys.byConversation(conversationId), (current = []) => {
          if (current.some((message) => message.id === savedMessage.id)) return current;
          return [...current, savedMessage];
        });
        patchConversationListLastMessage(queryClient, conversationId, savedMessage);

        return savedMessage;
      } catch (error: unknown) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to send message';
        toast.error(message);
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, queryClient]
  );

  const setTyping = useCallback(async (conversation_id: string, isTyping: boolean) => {
    try {
      await axios.post(`/api/conversations/${conversation_id}/typing`, { is_typing: isTyping });
    } catch {
      // typing is best-effort
    }
  }, []);

  return {
    messages: messagesQuery.data ?? [],
    loading: messagesQuery.isLoading,
    error: messagesQuery.error,
    sendMessage,
    typingUsers,
    setTyping,
    isSending,
  };
};

export default useMessages;
