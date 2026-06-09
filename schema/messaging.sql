-- Messaging schema for conversations and messages
-- Run this on your database (Supabase) to create necessary tables

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  created_at timestamptz DEFAULT now()
);

-- Participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE (conversation_id, user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  body text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Typing & presence (optional helper table)
CREATE TABLE IF NOT EXISTS typing_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  is_typing boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (conversation_id, user_id)
);
