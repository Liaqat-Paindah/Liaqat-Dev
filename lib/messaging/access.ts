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

  const missingFromParticipants = messageConversationIds.filter(
    (id) => !participantIds.includes(id)
  );

  if (missingFromParticipants.length) {
    await supabaseAdmin.from('conversation_participants').upsert(
      missingFromParticipants.map((conversationId) => ({
        conversation_id: conversationId,
        user_id: userId,
      })),
      { onConflict: 'conversation_id,user_id', ignoreDuplicates: true }
    );
  }

  return Array.from(new Set([...participantIds, ...messageConversationIds]));
}

export async function isConversationParticipant(
  conversationId: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('conversation_participants')
    .select('conversation_id')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Participant lookup failed:', error);
    return false;
  }

  if (data) return true;

  const { data: messageRow, error: messageError } = await supabaseAdmin
    .from('messages')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('sender_id', userId)
    .limit(1)
    .maybeSingle();

  if (messageError) {
    console.error('Message access lookup failed:', messageError);
    return false;
  }

  if (messageRow) {
    await ensureConversationParticipant(conversationId, userId);
    return true;
  }

  return false;
}
