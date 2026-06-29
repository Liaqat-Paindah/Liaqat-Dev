'use client';

import { clearConversationUnread, patchConversationListLastMessage } from '@/lib/messaging/cache';
import { messageKeys } from '@/lib/messaging/keys';
import {
  enrichMessageSender,
  getConversationChannelName,
  getDisplayName,
  type MessageBroadcastPayload,
  type TypingPayload,
} from '@/lib/messaging/realtime';
import type { Message } from '@/type/messaging';
import { useAuth } from '@/components/provider/authContext';
import { supabase } from '@/utils/supabase/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type TypingUser = {
  userId: string;
  name: string;
};

export const useMessages = (conversationId?: string | null) => {
  const queryClient = useQueryClient();
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const markedReadRef = useRef<string | null>(null);
  const typingTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const conversationIdRef = useRef(conversationId);
  const userIdRef = useRef(user?.id);

  conversationIdRef.current = conversationId;
  userIdRef.current = user?.id;

  const appendMessage = useCallback(
    (incoming: Message) => {
      const activeConversationId = conversationIdRef.current;
      if (!activeConversationId) return;

      queryClient.setQueryData<Message[]>(messageKeys.byConversation(activeConversationId), (current = []) => {
        if (current.some((message) => message.id === incoming.id)) return current;
        return [...current, incoming];
      });
      patchConversationListLastMessage(queryClient, activeConversationId, incoming);
    },
    [queryClient]
  );

  const appendMessageRef = useRef(appendMessage);
  appendMessageRef.current = appendMessage;

  const upsertTypingUser = useCallback((userId: string, name: string, isTyping: boolean) => {
    if (!userIdRef.current || userId === userIdRef.current) return;

    const existingTimeout = typingTimeoutsRef.current.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      typingTimeoutsRef.current.delete(userId);
    }

    if (!isTyping) {
      setTypingUsers((prev) => prev.filter((entry) => entry.userId !== userId));
      return;
    }

    setTypingUsers((prev) => {
      const others = prev.filter((entry) => entry.userId !== userId);
      return [...others, { userId, name }];
    });

    typingTimeoutsRef.current.set(
      userId,
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((entry) => entry.userId !== userId));
        typingTimeoutsRef.current.delete(userId);
      }, 3000)
    );
  }, []);

  const upsertTypingUserRef = useRef(upsertTypingUser);
  upsertTypingUserRef.current = upsertTypingUser;

  const messagesQuery = useQuery({
    queryKey: messageKeys.byConversation(conversationId || ''),
    queryFn: async () => {
      const response = await axios.get<Message[]>(`/api/messages/${conversationId}`);
      return response.data;
    },
    enabled: Boolean(conversationId) && isAuthenticated && !authLoading,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (!conversationId || !isAuthenticated || authLoading) {
      setTypingUsers([]);
      markedReadRef.current = null;
      return;
    }

    const activeConversationId = conversationId;
    const channel = supabase.channel(getConversationChannelName(activeConversationId), {
      config: {
        broadcast: { self: false },
      },
    });

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        const data = payload as TypingPayload;
        if (!data?.user_id) return;
        upsertTypingUserRef.current(data.user_id, data.name || 'Someone', Boolean(data.is_typing));
      })
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        const data = payload as MessageBroadcastPayload;
        if (!data?.message) return;
        void enrichMessageSender(data.message).then((message) => appendMessageRef.current(message));
      })
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConversationId}` },
        (payload) => {
          void enrichMessageSender(payload.new as Message).then((message) => appendMessageRef.current(message));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConversationId}` },
        (payload) => {
          const updated = payload.new as Message;
          queryClient.setQueryData<Message[]>(messageKeys.byConversation(activeConversationId), (current = []) =>
            current.map((message) => (message.id === updated.id ? { ...message, ...updated } : message))
          );
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channelRef.current = channel;
        }
      });

    return () => {
      channelRef.current = null;
      typingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      typingTimeoutsRef.current.clear();
      setTypingUsers([]);
      void supabase.removeChannel(channel);
    };
  }, [conversationId, isAuthenticated, authLoading, queryClient]);

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

  const broadcastTyping = useCallback(
    (isTyping: boolean) => {
      if (!user?.id || !channelRef.current) return;

      const name = getDisplayName(
        profile
          ? {
              id: profile.id,
              first_name: profile.first_name,
              last_name: profile.last_name,
              email: profile.email,
            }
          : null,
        'Someone'
      );

      void channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: user.id, is_typing: isTyping, name } satisfies TypingPayload,
      });
    },
    [user?.id, profile]
  );

  const setTyping = useCallback(
    async (conversation_id: string, isTyping: boolean) => {
      broadcastTyping(isTyping);

      try {
        await axios.post(`/api/conversations/${conversation_id}/typing`, { is_typing: isTyping });
      } catch {
        // typing persistence is best-effort
      }
    },
    [broadcastTyping]
  );

  const sendMessage = useCallback(
    async (_conversation_id: string, body: string, metadata?: Record<string, unknown>) => {
      if (!conversationId) throw new Error('Missing conversation id');

      broadcastTyping(false);
      setIsSending(true);

      try {
        const response = await axios.post<Message>(`/api/messages/${conversationId}`, {
          conversation_id: conversationId,
          body,
          metadata,
        });
        const savedMessage = response.data;

        appendMessage(savedMessage);

        void channelRef.current?.send({
          type: 'broadcast',
          event: 'message',
          payload: { message: savedMessage } satisfies MessageBroadcastPayload,
        });

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
    [conversationId, appendMessage, broadcastTyping]
  );

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
