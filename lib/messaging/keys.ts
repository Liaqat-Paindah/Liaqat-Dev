export const conversationKeys = {
  all: ['conversations'] as const,
  list: () => [...conversationKeys.all, 'list'] as const,
  detail: (conversationId: string) => [...conversationKeys.all, 'detail', conversationId] as const,
};

export const messageKeys = {
  all: ['messages'] as const,
  byConversation: (conversationId: string) => [...messageKeys.all, conversationId] as const,
};
