import type { Message, MessageProfile } from '@/type/messaging';
import { supabase } from '@/utils/supabase/supabase';

export type TypingPayload = {
  user_id: string;
  is_typing: boolean;
  name: string;
};

export type MessageBroadcastPayload = {
  message: Message;
};

export function getConversationChannelName(conversationId: string) {
  return `conversation:${conversationId}`;
}

export function getDisplayName(profile?: MessageProfile | null, fallback = 'Someone') {
  if (!profile) return fallback;
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
  return fullName || profile.email || fallback;
}

export async function enrichMessageSender(message: Message): Promise<Message> {
  if (message.sender) return message;

  const { data } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email')
    .eq('id', message.sender_id)
    .maybeSingle();

  return { ...message, sender: data || null };
}
