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

    const { data: convs, error } = await supabase
      .from('conversations')
      .select('id, title, topic, created_at, conversation_participants(user_id), messages(*)')
      .eq('conversation_participants.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    // Build summary per conversation
    const summaries = (convs || []).map((c: any) => {
      const lastMessage = (c.messages || []).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).slice(-1)[0] || null;
      const unread = (c.messages || []).filter((m: any) => !m.read && m.sender_id !== user.id).length;

      return {
        id: c.id,
        title: c.title,
        topic: c.topic,
        participants: (c.conversation_participants || []).map((p: any) => p.user_id),
        lastMessage,
        unread,
        created_at: c.created_at,
      };
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
    const title: string = body.title || null;
    const topic: string | null = body.topic || null;

    if (!Array.isArray(participantIds) || participantIds.length < 2) {
      return NextResponse.json({ message: 'participantIds must be an array with at least 2 items' }, { status: 400 });
    }

    // Try to find an existing conversation that has exactly the same participants (simple heuristic)
    // This query fetches conversations that include any of the participant ids, then we filter in JS
    const { data: convCandidates, error } = await supabase
      .from('conversations')
      .select('id, title, topic, conversation_participants(user_id)');

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    const normalized = participantIds.map((id) => id.toString()).sort();

    for (const c of convCandidates || []) {
      const parts = (c.conversation_participants || []).map((p: any) => p.user_id.toString()).sort();
      const sameParticipants = parts.length === normalized.length && parts.every((v: string, i: number) => v === normalized[i]);
      const sameTopic = topic ? c.topic === topic : !c.topic;
      if (sameParticipants && sameTopic) {
        return NextResponse.json({ id: c.id, existing: true, topic: c.topic });
      }
    }

    // Create conversation
    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert({ title: title || topic, topic })
      .select()
      .single();

    if (createError || !newConv) return NextResponse.json({ message: createError?.message || 'Could not create' }, { status: 500 });

    // Insert participants
    const participants = participantIds.map((id) => ({ conversation_id: newConv.id, user_id: id }));
    const { error: partError } = await supabase.from('conversation_participants').insert(participants);

    if (partError) return NextResponse.json({ message: partError.message }, { status: 500 });

    return NextResponse.json({ id: newConv.id, existing: false, topic: newConv.topic });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
