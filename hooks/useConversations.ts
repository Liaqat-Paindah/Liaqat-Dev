'use client';

import type { ConversationDetail, ConversationSummary } from '@/type/messaging';
import { useAuth } from '@/components/provider/authContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const conversationKeys = {
  all: ['conversations'] as const,
  list: () => [...conversationKeys.all, 'list'] as const,
  detail: (conversationId: string) => [...conversationKeys.all, 'detail', conversationId] as const,
};

export const useConversations = () => {
  const { isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: async () => {
      const response = await axios.get<ConversationSummary[]>('/api/conversations');
      return response.data;
    },
    enabled: isAuthenticated && !loading,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    staleTime: 10 * 1000,
  });
};

export const useConversation = (conversationId?: string | null) => {
  const { isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: conversationKeys.detail(conversationId || ''),
    queryFn: async () => {
      const response = await axios.get<ConversationDetail>(`/api/conversations/${conversationId}`);
      return response.data;
    },
    enabled: Boolean(conversationId) && isAuthenticated && !loading,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createConversation'],
    mutationFn: async (payload: { participantIds: string[]; title?: string | null; topic?: string | null }) => {
      const response = await axios.post<{ id: string; existing: boolean; topic?: string | null }>(
        '/api/conversations',
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to start conversation';
      toast.error(message);
    },
  });
};
