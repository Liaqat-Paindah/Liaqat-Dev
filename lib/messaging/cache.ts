import type { ConversationSummary, Message } from '@/type/messaging';
import { conversationKeys } from '@/lib/messaging/keys';
import type { QueryClient } from '@tanstack/react-query';

export function patchConversationListLastMessage(
  queryClient: QueryClient,
  conversationId: string,
  message: Message
) {
  queryClient.setQueryData<ConversationSummary[]>(conversationKeys.list(), (current) => {
    if (!current) return current;

    const updated = current.map((conversation) =>
      conversation.id === conversationId ? { ...conversation, lastMessage: message } : conversation
    );

    return updated.sort((a, b) => {
      const aTime = a.lastMessage?.created_at || a.created_at;
      const bTime = b.lastMessage?.created_at || b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  });
}

export function clearConversationUnread(queryClient: QueryClient, conversationId: string) {
  queryClient.setQueryData<ConversationSummary[]>(conversationKeys.list(), (current) => {
    if (!current) return current;
    return current.map((conversation) =>
      conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation
    );
  });
}
