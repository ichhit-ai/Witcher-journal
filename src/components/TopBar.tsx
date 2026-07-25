import React from 'react';
import { Package, Coins, X, ChevronLeft, ChevronRight, Home, Volume2, VolumeX } from 'lucide-react';
import { Show, SignInButton, UserButton } from '@clerk/react';
import type { PlayerStats } from '../types';
import { playClickSound } from '../services/soundSynth';

interface TopBarProps {
  stats: PlayerStats;
  activeTab: 'QUESTS' | 'BESTIARY' | 'JOURNAL';
  onTabChange: (tab: 'QUESTS' | 'BESTIARY' | 'JOURNAL') => void;
  onClose: () => void;
  onOpenEditor: () => void;
  completedQuestsCount: number;
  totalQuestsCount: number;
  isXpFlashing?: boolean;
  isLevelPulsing?: boolean;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
}

const TAB_ORDER: Array<'QUESTS' | 'BESTIARY' | 'JOURNAL'> = ['QUESTS', 'BESTIARY', 'JOURNAL'];
const TAB_LABELS: Record<string, string> = {
  'QUESTS': 'QUESTS',
  'BESTIARY': 'BESTIARY',
  'JOURNAL': 'JOURNAL',
};

// Section labels that flank the center title (like WORLD MAP ... CHARACTER in-game)
const LEFT_HINT: Record<string, string> = {
  'QUESTS': '',
  'BESTIARY': 'QUESTS',
  'JOURNAL': 'BESTIARY',
};
const RIGHT_HINT: Record<string, string> = {
  'QUESTS': 'BESTIARY',
  'BESTIARY': 'JOURNAL',
  'JOURNAL': '',
};

export const TopBar: React.FC<TopBarProps> = ({
  stats,
  activeTab,
  onTabChange,
  onClose,
  completedQuestsCount,
  totalQuestsCount,
  isXpFlashing = false,
  isLevelPulsing = false,
  isAudioPlaying = false,
  onToggleAudio,
}) => {
  const currentLevel = Math.floor(stats.totalXp / 1000) + 1;
  const xpIntoLevel = stats.totalXp % 1000;
  const xpPercentage = Math.min((xpIntoLevel / 1000) * 100, 100);

  const currentIdx = TAB_ORDER.indexOf(activeTab);

  const goPrev = () => {
    playClickSound();
    const prevIdx = (currentIdx - 1 + TAB_ORDER.length) % TAB_ORDER.length;
    onTabChange(TAB_ORDER[prevIdx]);
  };

  const goNext = () => {
    playClickSound();
    const nextIdx = (currentIdx + 1) % TAB_ORDER.length;
    onTabChange(TAB_ORDER[nextIdx]);
  };

  return (
    <div className="journal-topbar">
      {/* Left: Home / Main Page button + inventory tally + crowns */}
      <div className="topbar-left">
        <button
          className="topbar-home-btn"
          onClick={() => { playClickSound(); onClose(); }}
          title="Return to Main Game Screen"
        >
          <Home size={16} />
          <span>MAIN PAGE</span>
        </button>
        <div className="tally-item">
          <Package size={14} style={{ color: 'var(--text-dim)' }} />
          <span><span className="tally-val">{completedQuestsCount}</span> / {totalQuestsCount}</span>
        </div>
        <div className="tally-item">
          <Coins size={14} style={{ color: 'var(--gold-primary)' }} />
          <span className="tally-val">{stats.crowns}</span>
        </div>
      </div>

      {/* Center: ◀◀ QUESTS ▶▶ with flanking section labels + dots */}
      <div className="topbar-center">
        <div className="topbar-nav-row">
          <span className="nav-section-label">{LEFT_HINT[activeTab]}</span>
          <button className="nav-arrow" onClick={goPrev} title="Previous section">
            <ChevronLeft size={16} /><ChevronLeft size={16} style={{ marginLeft: -10 }} />
          </button>
          <span className="nav-title">{TAB_LABELS[activeTab]}</span>
          <button className="nav-arrow" onClick={goNext} title="Next section">
            <ChevronRight size={16} /><ChevronRight size={16} style={{ marginLeft: -10 }} />
          </button>
          <span className="nav-section-label">{RIGHT_HINT[activeTab]}</span>
        </div>
        <div className="nav-dots">
          {TAB_ORDER.map((tab, idx) => (
            <button
              key={tab}
              className={`nav-dot ${idx === currentIdx ? 'active' : ''}`}
              onClick={() => { playClickSound(); onTabChange(tab); }}
              title={tab}
            />
          ))}
        </div>
      </div>

      {/* Right: LEVEL + XP bar + audio speaker + auth + close */}
      <div className="topbar-right">
        <div className="level-container">
          <span className="level-label">LEVEL</span>
          <span className={`level-number ${isLevelPulsing ? 'pulse-level' : ''}`}>
            {currentLevel}
          </span>
          <div className="xp-bar-outer">
            <div
              className={`xp-bar-inner ${isXpFlashing ? 'flash-xp' : ''}`}
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <span className="xp-text">{xpIntoLevel}/{1000}</span>
        </div>

        {onToggleAudio && (
          <button
            className="topbar-audio-btn"
            onClick={() => { playClickSound(); onToggleAudio(); }}
            title={isAudioPlaying ? "Mute Background Music" : "Play Background Music"}
          >
            {isAudioPlaying ? <Volume2 size={16} style={{ color: 'var(--gold-bright)' }} /> : <VolumeX size={16} style={{ color: 'var(--text-dim)' }} />}
          </button>
        )}

        <div className="clerk-auth-topbar">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="witcher-auth-btn-sm">SIGN IN</button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>

        <button
          className="close-btn"
          onClick={() => { playClickSound(); onClose(); }}
          title="Return to Main Page (ESC)"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

