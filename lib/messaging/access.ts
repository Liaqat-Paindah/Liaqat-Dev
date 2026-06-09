import { supabaseAdmin } from '@/utils/supabase/admin';

export async function ensureConversationParticipant(
  conversationId: string,
  userId: string
): Promise<void> {
  const { error } = await supabaseAdmin.from('conversation_participants').upsert(
    { conversation_id: conversationId, user_id: userId },
    { onConflict: 'conversation_id,user_id', ignoreDuplicates: true }
  );

  if (error) {
    console.error('Failed to ensure participant:', error);
  }
}

export async function conversationExists(conversationId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .maybeSingle();

  if (error) {
    console.error('Conversation lookup failed:', error);
    return false;
  }

  return Boolean(data);
}

/** Any authenticated user can access topics; joining adds them as a participant. */
export async function grantConversationAccess(
  conversationId: string,
  userId: string
): Promise<boolean> {
  const exists = await conversationExists(conversationId);
  if (!exists) return false;

  await ensureConversationParticipant(conversationId, userId);
  return true;
}

export async function getUserConversationIds(userId: string): Promise<string[]> {
  const { data: memberships, error: membershipError } = await supabaseAdmin
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId);

  if (membershipError) {
    console.error('Participant lookup failed:', membershipError);
  }

  const { data: sentMessages, error: messageError } = await supabaseAdmin
    .from('messages')
    .select('conversation_id')
    .eq('sender_id', userId);

  if (messageError) {
    console.error('Message lookup failed:', messageError);
  }

  const participantIds = (memberships || [])
    .map((row) => row.conversation_id)
    .filter(Boolean) as string[];

  const messageConversationIds = (sentMessages || [])
    .map((row) => row.conversation_id)
    .filter(Boolean) as string[];

  return Array.from(new Set([...participantIds, ...messageConversationIds]));
}
