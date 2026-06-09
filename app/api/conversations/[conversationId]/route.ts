import { resolveRouteParams } from '@/lib/api/route-params';
import { isConversationParticipant } from '@/lib/messaging/access';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

type RouteContext = { params: { conversationId: string } | Promise<{ conversationId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { conversationId } = await resolveRouteParams(context.params);
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (!conversationId) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    const allowed = await isConversationParticipant(conversationId, user.id);
    if (!allowed) {
      return NextResponse.json({ message: 'Conversation not found or access denied' }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from('conversations')
      .select('id, title, topic, created_at, conversation_participants(user_id)')
      .eq('id', conversationId)
      .single();

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    const participantIds = (data.conversation_participants || []).map((p: { user_id: string }) => p.user_id);
    let profiles: Array<{ id: string; first_name: string | null; last_name: string | null; email: string | null }> = [];

    if (participantIds.length) {
      const { data: profileRows } = await supabaseAdmin
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', participantIds);
      profiles = profileRows || [];
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      topic: data.topic || data.title,
      created_at: data.created_at,
      participants: participantIds,
      participant_profiles: profiles,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
