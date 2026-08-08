**Chat System Documentation**

This document describes how the in-app chat/messaging system works and the primary technologies used.

**Overview:**
- **Purpose:** Real-time chat between authenticated users grouped into conversations (topics).
- **High-level flow:** Frontend UI uses hooks to fetch conversation lists and messages from Next.js API routes; real-time updates (messages and typing events) are pushed via Supabase Realtime channels; writes (new messages, typing status) go through Next.js API endpoints which use a Supabase admin client to persist data.

**Key components & files:**
- **Frontend hooks:** `hooks/useConversations.ts` and `hooks/useMessages.tsx` — fetch conversation lists/details and messages, manage React Query cache, and subscribe to realtime channels.
- **UI components:** `components/dashboard/messages/ChatWindow.tsx`, `MessageInput`, `TypingIndicator` — render messages, input and typing UX.
- **Realtime helpers:** `lib/messaging/realtime.ts` — channel naming, typing/message payload shapes, and message enrichment (loads sender profile from Supabase).
- **Cache/helpers:** `lib/messaging/keys.ts` and `lib/messaging/cache.ts` — React Query keys and helpers to patch conversation lists on new messages.
- **Access control & helpers:** `lib/messaging/access.ts` — ensures participants and checks conversation access.
- **API endpoints:**
  - `app/api/conversations/route.ts` — list & create conversations
  - `app/api/conversations/[conversationId]/typing/route.ts` — persist typing status
  - `app/api/messages/[conversationId]/route.ts` — list, create, and mark messages read
- **Supabase clients:** `utils/supabase/supabase.ts`, `utils/supabase/admin.ts`, `utils/supabase/server.ts` — browser, admin (service role), and server-side clients.
- **Types:** `type/messaging.ts` — `Message`, `ConversationSummary`, `ConversationDetail` shapes.

**Real-time architecture & flow:**
- When a user opens a conversation, `useMessages`:
  - Loads historical messages via `GET /api/messages/[conversationId]`.
  - Subscribes to a Supabase Realtime channel named `conversation:<id>`.
  - Listens for:`broadcast` events `typing` and `message`, and `postgres_changes` for INSERT/UPDATE on `messages`.
  - For incoming messages, messages are enriched with sender profile (`enrichMessageSender`) and appended into the React Query cache.
- Sending a message:
  - Frontend POSTs to `/api/messages/[conversationId]` which inserts the message using `supabaseAdmin` and returns the saved message with sender profile.
  - Client broadcasts a `message` event on the channel so other subscribers see it immediately.
- Typing indicator:
  - Frontend broadcasts `typing` events on the same channel and also POSTs to `/api/conversations/[conversationId]/typing` (best-effort persistence).

**Database & tables (observed):**
- `conversations` — conversation metadata (id, title, topic)
- `conversation_participants` — mapping of users to conversations
- `messages` — messages (conversation_id, sender_id, body, metadata, read, created_at)
- `profiles` — user profile info referenced to enrich messages
- `typing_status` — optional persisted typing states

**Tech stack & libraries used:**
- Framework: Next.js (app router)
- Realtime & DB: Supabase (Postgres + Realtime)
- Client libs: `@supabase/ssr`, `@supabase/supabase-js`
- Data fetching/caching: `@tanstack/react-query` (React Query)
- HTTP client: `axios`
- UI: React + Tailwind (shadcn components, Radix primitives)
- Notifications: `sonner`
- Language: TypeScript

**Environment variables (used):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server/admin)

**How to run / dev notes:**
- Run dev server as usual: `npm run dev` or `pnpm dev` from project root.
- Ensure Supabase env vars are set and a service role key is available for server API routes.

**Where to look next (suggested improvements):**
- Add sequence/architecture diagrams (Mermaid) for onboarding developers.
- Add tests for API endpoints and realtime subscription handling.
- Harden access control rules if stricter privacy is required (e.g., row-level security policies).

---
Document created from source inspection of key files in this repository.
