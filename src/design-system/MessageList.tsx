import * as React from "react";
import { color, font, radius, space } from "./tokens";

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  avatar?: string;
  isOwn?: boolean;
}

export interface MessageListProps {
  messages: Message[];
  style?: React.CSSProperties;
}

function AvatarCircle({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: radius.full,
        backgroundColor: color.primary,
        color: color.textOnPrimary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: font.size.xs,
        fontWeight: font.weight.semibold,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isOwn = message.isOwn;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isOwn ? "row-reverse" : "row",
        gap: space[2],
        alignItems: "flex-end",
        maxWidth: "80%",
        alignSelf: isOwn ? "flex-end" : "flex-start",
      }}
    >
      {!isOwn && <AvatarCircle name={message.sender} />}
      <div style={{ display: "flex", flexDirection: "column", gap: space[1] }}>
        {!isOwn && (
          <span style={{ fontSize: font.size.xs, fontWeight: font.weight.medium, color: color.textLabel }}>
            {message.sender}
          </span>
        )}
        <div
          style={{
            padding: `${space[3]} ${space[4]}`,
            borderRadius: radius.lg,
            backgroundColor: isOwn ? color.primary : color.neutral100,
            color: isOwn ? color.textOnPrimary : color.textDefault,
            fontSize: font.size.sm,
            lineHeight: font.lineHeight.normal,
            borderBottomRightRadius: isOwn ? radius.sm : radius.lg,
            borderBottomLeftRadius: isOwn ? radius.lg : radius.sm,
          }}
        >
          {message.content}
        </div>
        <span
          style={{
            fontSize: font.size["2xs"],
            color: color.textPlaceholder,
            textAlign: isOwn ? "right" : "left",
          }}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

export function MessageList({ messages, style }: MessageListProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: space[4],
        fontFamily: font.family,
        padding: space[4],
        ...style,
      }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}
