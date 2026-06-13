import React, { useState } from 'react';
import { MessageList, PrimaryButton, TextArea } from '../../../design-system';
import type { ChatMessage } from '../data/types';
import { formatTimestamp } from '../data/activity';

export function JobMessagesTab({
  messages,
  currentUserId,
  onSend,
}: {
  messages: ChatMessage[];
  currentUserId: string;
  onSend: (body: string) => void;
}) {
  const [draft, setDraft] = useState('');

  const adapted = messages.map((m) => ({
    id: m.id,
    sender: m.authorName,
    content: m.body,
    timestamp: formatTimestamp(m.timestamp),
    isOwn: m.authorId === currentUserId,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          backgroundColor: 'var(--ads-bg-muted)',
          borderRadius: 'var(--ads-radius-sm)',
          padding: '12px',
          minHeight: '180px',
        }}
      >
        {adapted.length === 0 ? (
          <div style={{ color: 'var(--ads-text-muted)', fontSize: '13px', textAlign: 'center', padding: '24px' }}>
            No messages yet. Start the conversation with the lab.
          </div>
        ) : (
          <MessageList messages={adapted} />
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <TextArea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message to the lab"
          rows={3}
          fullWidth
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <PrimaryButton
            size={36}
            disabled={!draft.trim()}
            onClick={() => {
              if (!draft.trim()) return;
              onSend(draft.trim());
              setDraft('');
            }}
          >
            Send
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
