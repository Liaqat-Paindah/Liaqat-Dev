import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { conversationId: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { conversationId } = params;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    const messages = data || [];
    const senderIds = Array.from(new Set(messages.map((message: any) => message.sender_id)));
    let profiles: any[] = [];

    if (senderIds.length) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', senderIds);

      if (profileError) {
        console.error(profileError);
      } else {
        profiles = profileData || [];
      }
    }

    const profileMap = new Map(profiles.map((profile: any) => [profile.id, profile]));
    const enrichedMessages = messages.map((message: any) => ({
      ...message,
      sender: profileMap.get(message.sender_id) || null,
    }));

    return NextResponse.json(enrichedMessages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { conversationId: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { conversationId } = params;
    const body = await request.json();
    const { body: text, metadata } = body;

    if (!text) return NextResponse.json({ message: 'Missing message body' }, { status: 400 });

    const { data, error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: user.id, body: text, metadata }).select().single();

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { conversationId: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { conversationId } = params;
    // Mark all messages in conversation as read for this user
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id);

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
