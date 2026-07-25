import React, { useState } from 'react';
import { X, Pin, Check, Trash2, AlertTriangle, ScrollText, Plus } from 'lucide-react';
import type { NoticeEntry } from '../types';
import { playClickSound, playObjectiveSound } from '../services/soundSynth';

interface NoticeBoardProps {
  notices: NoticeEntry[];
  onAddNotice: (text: string) => void;
  onAcceptNotice: (noticeId: string) => void;
  onDismissNotice: (noticeId: string) => void;
  onPinNotice: (noticeId: string) => void;
  onClose: () => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({
  notices,
  onAddNotice,
  onAcceptNotice,
  onDismissNotice,
  onPinNotice,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    playObjectiveSound();
    onAddNotice(inputText.trim());
    setInputText('');
  };

  const getDaysSince = (dateStr: string): number => {
    const created = new Date(dateStr);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  const activeNotices = notices.filter((n) => n.status === 'pending' || n.status === 'pinned');
  const pinnedNotices = activeNotices.filter((n) => n.status === 'pinned');
  const pendingNotices = activeNotices.filter((n) => n.status === 'pending');

  return (
    <div className="notice-board-overlay" onClick={onClose}>
      <div className="notice-board-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notice-board-header">
          <div className="notice-board-title">
            <ScrollText size={20} style={{ color: 'var(--gold-bright)' }} />
            <span>NOTICE BOARD</span>
          </div>
          <button className="notice-board-close" onClick={() => { playClickSound(); onClose(); }}>
            <X size={18} />
          </button>
        </div>

        <div className="notice-board-hint">
          Post quick notes, ideas, and reminders. Accept them as Quests when ready.
        </div>

        {/* Quick Capture Input */}
        <form className="notice-input-form" onSubmit={handleSubmit}>
          <input
            className="notice-input"
            type="text"
            placeholder="Scrawl a new notice..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            autoFocus
          />
          <button type="submit" className="notice-add-btn" disabled={!inputText.trim()}>
            <Plus size={16} /> POST
          </button>
        </form>

        {/* Notices List */}
        <div className="notice-board-list">
          {activeNotices.length === 0 && (
            <div className="notice-empty">
              The notice board is empty. Scrawl your first note above.
            </div>
          )}

          {/* Pinned first */}
          {pinnedNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              daysSince={getDaysSince(notice.createdAt)}
              onAccept={onAcceptNotice}
              onDismiss={onDismissNotice}
              onPin={onPinNotice}
            />
          ))}

          {/* Then pending */}
          {pendingNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              daysSince={getDaysSince(notice.createdAt)}
              onAccept={onAcceptNotice}
              onDismiss={onDismissNotice}
              onPin={onPinNotice}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Individual Notice Card
const NoticeCard: React.FC<{
  notice: NoticeEntry;
  daysSince: number;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
  onPin: (id: string) => void;
}> = ({ notice, daysSince, onAccept, onDismiss, onPin }) => {
  const isStale = daysSince >= 3 && notice.status === 'pending';

  return (
    <div className={`notice-card ${notice.status === 'pinned' ? 'pinned' : ''} ${isStale ? 'stale' : ''}`}>
      <div className="notice-card-body">
        <div className="notice-card-text">{notice.text}</div>
        <div className="notice-card-meta">
          {notice.status === 'pinned' && (
            <span className="notice-pin-badge"><Pin size={10} /> PINNED</span>
          )}
          {isStale && (
            <span className="notice-stale-badge"><AlertTriangle size={10} /> Gathering dust...</span>
          )}
          <span className="notice-date">{daysSince === 0 ? 'Today' : `${daysSince}d ago`}</span>
        </div>
      </div>
      <div className="notice-card-actions">
        <button
          className="notice-action accept"
          onClick={() => { playObjectiveSound(); onAccept(notice.id); }}
          title="Accept as Quest"
        >
          <Check size={14} />
        </button>
        <button
          className="notice-action pin"
          onClick={() => { playClickSound(); onPin(notice.id); }}
          title={notice.status === 'pinned' ? 'Unpin' : 'Pin'}
        >
          <Pin size={14} />
        </button>
        <button
          className="notice-action dismiss"
          onClick={() => { playClickSound(); onDismiss(notice.id); }}
          title="Dismiss"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
