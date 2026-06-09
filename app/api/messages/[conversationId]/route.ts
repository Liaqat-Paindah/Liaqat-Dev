import { resolveRouteParams } from '@/lib/api/route-params';
import { grantConversationAccess } from '@/lib/messaging/access';
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
    if (!conversationId) return NextResponse.json({ message: 'Missing conversation id' }, { status: 400 });

    const allowed = await grantConversationAccess(conversationId, user.id);
    if (!allowed) {
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('id, conversation_id, sender_id, body, metadata, read, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    const messages = data || [];
    const senderIds = Array.from(new Set(messages.map((message) => message.sender_id)));
    let profiles: Array<{ id: string; first_name: string | null; last_name: string | null; email: string | null }> = [];

    if (senderIds.length) {
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', senderIds);

      if (profileError) {
        console.error(profileError);
      } else {
        profiles = profileData || [];
      }
    }

    const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
    const enrichedMessages = messages.map((message) => ({
      ...message,
      sender: profileMap.get(message.sender_id) || null,
    }));

    return NextResponse.json(enrichedMessages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { conversationId } = await resolveRouteParams(context.params);
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const payload = await request.json().catch(() => ({}));
    const { conversation_id: bodyConversationId, body: text, metadata } = payload || {};
    const effectiveConversationId = conversationId || bodyConversationId;

    if (!text?.trim()) return NextResponse.json({ message: 'Missing message body' }, { status: 400 });
    if (!effectiveConversationId) return NextResponse.json({ message: 'Missing conversation id' }, { status: 400 });

    const allowed = await grantConversationAccess(effectiveConversationId, user.id);
    if (!allowed) {
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }

    const insertPayload = {
      conversation_id: effectiveConversationId,
      sender_id: user.id,
      body: text.trim(),
      metadata: metadata || {},
      read: false,
    };

    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert(insertPayload)
      .select('id, conversation_id, sender_id, body, metadata, read, created_at')
      .single();

    if (error || !data) {
      console.error('Failed to insert message:', error);
      return NextResponse.json({ message: error?.message || 'Failed to save message' }, { status: 500 });
    }

    const { data: profileData } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('id', user.id)
      .maybeSingle();

    return NextResponse.json({ ...data, sender: profileData || null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(_request: Request, context: RouteContext) {
  try {
    const { conversationId } = await resolveRouteParams(context.params);
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (!conversationId) return NextResponse.json({ message: 'Missing conversation id' }, { status: 400 });

    const allowed = await grantConversationAccess(conversationId, user.id);
    if (!allowed) {
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }

    const { error } = await supabaseAdmin
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
