"use client";

type TypingUser = {
  userId: string;
  name: string;
};

export const TypingIndicator = ({ users }: { users: TypingUser[] }) => {
  if (!users.length) return null;

  const label =
    users.length === 1
      ? `${users[0].name} is typing`
      : users.length === 2
        ? `${users[0].name} and ${users[1].name} are typing`
        : `${users[0].name} and ${users.length - 1} others are typing`;

  return (
    <div className="flex items-center gap-2 px-1 py-2 text-sm text-muted-foreground">
      <span>{label}</span>
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:300ms]" />
      </span>
    </div>
  );
};

export default TypingIndicator;
