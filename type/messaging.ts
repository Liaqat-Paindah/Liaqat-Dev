export type MessageProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  metadata: Record<string, unknown>;
  read: boolean;
  created_at: string;
  sender?: MessageProfile | null;
};

export type ConversationSummary = {
  id: string;
  title: string | null;
  topic: string | null;
  participants: string[];
  lastMessage: Message | null;
  unread: number;
  created_at: string;
};

export type ConversationDetail = {
  id: string;
  title: string | null;
  topic: string | null;
  created_at: string;
  participants: string[];
  participant_profiles: MessageProfile[];
};
