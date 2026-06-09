'use client';

import type { Message } from '@/type/messaging';
import { supabase } from '@/utils/supabase/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { conversationKeys } from './useConversations';

export const messageKeys = {
  all: ['messages'] as const,
  byConversation: (conversationId: string) => [...messageKeys.all, conversationId] as const,
};

export const useMessages = (conversationId?: string | null) => {
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const messagesQuery = useQuery({
    queryKey: messageKeys.byConversation(conversationId || ''),
    queryFn: async () => {
      const response = await axios.get<Message[]>(`/api/messages/${conversationId}`);
      return response.data;
    },
    enabled: Boolean(conversationId),
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000,
  });

  useEffect(() => {
    if (!conversationId) {
      setTypingUsers([]);
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
          queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
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

  const sendMessageMutation = useMutation({
    mutationKey: ['sendMessage', conversationId],
    mutationFn: async ({ body, metadata }: { body: string; metadata?: Record<string, unknown> }) => {
      const response = await axios.post<Message>(`/api/messages/${conversationId}`, {
        conversation_id: conversationId,
        body,
        metadata,
      });
      return response.data;
    },
    onSuccess: (savedMessage) => {
      if (!conversationId) return;
      queryClient.setQueryData<Message[]>(messageKeys.byConversation(conversationId), (current = []) => {
        if (current.some((message) => message.id === savedMessage.id)) return current;
        return [...current, savedMessage];
      });
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to send message';
      toast.error(message);
    },
  });

  const markReadMutation = useMutation({
    mutationKey: ['markRead', conversationId],
    mutationFn: async () => {
      await axios.put(`/api/messages/${conversationId}`);
    },
    onSuccess: () => {
      if (!conversationId) return;
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });

  const setTyping = useCallback(async (conversation_id: string, isTyping: boolean) => {
    try {
      await axios.post(`/api/conversations/${conversation_id}/typing`, { is_typing: isTyping });
    } catch {
      // typing is best-effort
    }
  }, []);

  const sendMessage = useCallback(
    async (conversation_id: string, body: string, metadata?: Record<string, unknown>) => {
      if (!conversation_id) throw new Error('Missing conversation id');
      return sendMessageMutation.mutateAsync({ body, metadata });
    },
    [sendMessageMutation]
  );

  const markRead = useCallback(
    async (conversation_id: string) => {
      if (!conversation_id) return;
      await markReadMutation.mutateAsync();
    },
    [markReadMutation]
  );

  return {
    messages: messagesQuery.data ?? [],
    loading: messagesQuery.isLoading,
    error: messagesQuery.error,
    sendMessage,
    markRead,
    typingUsers,
    setTyping,
    isSending: sendMessageMutation.isPending,
  };
};

export default useMessages;
