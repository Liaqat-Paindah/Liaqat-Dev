import { getUserConversationIds } from '@/lib/messaging/access';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const conversationIds = await getUserConversationIds(user.id);
    if (!conversationIds.length) {
      return NextResponse.json([]);
    }

    const { data: convs, error } = await supabaseAdmin
      .from('conversations')
      .select(
        'id, title, topic, created_at, conversation_participants(user_id), messages(id, conversation_id, sender_id, body, metadata, read, created_at)'
      )
      .in('id', conversationIds)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    const summaries = (convs || []).map((c) => {
      const lastMessage =
        (c.messages || [])
          .slice()
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .slice(-1)[0] || null;
      const unread = (c.messages || []).filter((m) => !m.read && m.sender_id !== user.id).length;

      return {
        id: c.id,
        title: c.title,
        topic: c.topic || c.title,
        participants: (c.conversation_participants || []).map((p: { user_id: string }) => p.user_id),
        lastMessage,
        unread,
        created_at: c.created_at,
      };
    });

    summaries.sort((a, b) => {
      const aTime = a.lastMessage?.created_at || a.created_at;
      const bTime = b.lastMessage?.created_at || b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return NextResponse.json(summaries);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const participantIds: string[] = body.participantIds || [];
    const title: string | null = body.title || null;
    const topic: string | null = body.topic || null;

    const uniqueParticipantIds = Array.from(
      new Set(participantIds.filter(Boolean).map((id) => id.toString()))
    );

    if (!uniqueParticipantIds.includes(user.id)) {
      uniqueParticipantIds.push(user.id);
    }

    if (uniqueParticipantIds.length < 1) {
      return NextResponse.json({ message: 'At least one participant is required' }, { status: 400 });
    }

    const normalized = uniqueParticipantIds.slice().sort();
    const normalizedTopic = topic || title;

    const { data: convCandidates, error } = await supabaseAdmin
      .from('conversations')
      .select('id, title, topic, conversation_participants(user_id)');

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    for (const c of convCandidates || []) {
      const parts = (c.conversation_participants || [])
        .map((p: { user_id: string }) => p.user_id.toString())
        .sort();
      const sameParticipants =
        parts.length === normalized.length && parts.every((value, index) => value === normalized[index]);
      const existingTopic = c.topic || c.title;
      const sameTopic = normalizedTopic ? existingTopic === normalizedTopic : !existingTopic;
      if (sameParticipants && sameTopic) {
        return NextResponse.json({ id: c.id, existing: true, topic: c.topic || c.title });
      }
    }

    const { data: newConv, error: createError } = await supabaseAdmin
      .from('conversations')
      .insert({ title: title || topic, topic: normalizedTopic })
      .select('id, title, topic, created_at')
      .single();

    if (createError || !newConv) {
      return NextResponse.json({ message: createError?.message || 'Could not create conversation' }, { status: 500 });
    }

    const participants = normalized.map((id) => ({ conversation_id: newConv.id, user_id: id }));
    const { error: partError } = await supabaseAdmin.from('conversation_participants').insert(participants);

    if (partError) {
      await supabaseAdmin.from('conversations').delete().eq('id', newConv.id);
      return NextResponse.json({ message: partError.message }, { status: 500 });
    }

    return NextResponse.json({
      id: newConv.id,
      existing: false,
      topic: newConv.topic || newConv.title,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
