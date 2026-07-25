import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Sparkles, Coins, Package, MapPin, Compass, Flame, ScrollText } from 'lucide-react';
import { Show, SignInButton, UserButton } from '@clerk/react';
import type { Quest } from '../types';
import { playClickSound } from '../services/soundSynth';

interface HomeScreenProps {
  onOpenJournal: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  trackedQuest?: Quest | null;
  playerLevel?: number;
  crowns?: number;
  completedQuestsCount?: number;
  totalQuestsCount?: number;
  onMeditate?: () => void;
  onOpenNoticeBoard?: () => void;
  noticeCount?: number;
}

// Atmospheric high-res Witcher-styled scenic images
const BACKGROUND_IMAGES = [
  '/assets/witcher_velen.png',
  '/assets/witcher_kaer_morhen.png',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop', // Dark foggy castle
  'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1920&auto=format&fit=crop', // Atmospheric misty forest
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop', // Dark mountain river landscape
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenJournal,
  isAudioPlaying,
  onToggleAudio,
  trackedQuest,
  playerLevel = 1,
  crowns = 300,
  completedQuestsCount = 0,
  totalQuestsCount = 0,
  onMeditate,
  onOpenNoticeBoard,
  noticeCount = 0,
}) => {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleOpen = () => {
    playClickSound();
    onOpenJournal();
  };

  // Helper to extract active objectives from tracked quest (top-level + subquests)
  const renderTrackedObjectives = () => {
    if (!trackedQuest) {
      return (
        <div className="hud-objective-item empty">
          <span className="hud-obj-bullet">◆</span>
          <span>Open Journal to track an active quest</span>
        </div>
      );
    }

    const activeTopObjs = trackedQuest.objectives.filter(o => !o.isCompleted);
    const completedTopObjs = trackedQuest.objectives.filter(o => o.isCompleted);

    const hasSubQuests = trackedQuest.subQuests && trackedQuest.subQuests.length > 0;

    return (
      <div className="hud-objectives-container">
        {/* Top level objectives */}
        {activeTopObjs.map((obj) => (
          <div key={obj.id} className="hud-objective-item active">
            <span className="hud-obj-bullet">◆</span>
            <span className="hud-obj-text">{obj.text}</span>
          </div>
        ))}

        {/* Subquests active objectives */}
        {hasSubQuests && trackedQuest.subQuests.map((sq) => {
          const activeSubObjs = sq.objectives.filter(o => !o.isCompleted);
          if (activeSubObjs.length === 0) return null;
          return (
            <div key={sq.id} className="hud-subquest-group">
              <div className="hud-subquest-title">{sq.title}:</div>
              {activeSubObjs.map((obj) => (
                <div key={obj.id} className="hud-objective-item active sub">
                  <span className="hud-obj-bullet">◆</span>
                  <span className="hud-obj-text">{obj.text}</span>
                </div>
              ))}
            </div>
          );
        })}

        {/* Completed objectives summary */}
        {completedTopObjs.length > 0 && activeTopObjs.length === 0 && (!hasSubQuests || trackedQuest.subQuests.every(sq => sq.isCompleted)) && (
          <div className="hud-objective-item completed">
            <span className="hud-obj-bullet check">✔</span>
            <span className="hud-obj-text">All Objectives Completed!</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="home-screen">
      {/* Background Slideshow */}
      <div
        className="home-slideshow"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGES[bgIndex]})` }}
      />
      <div className="home-vignette" />

      {/* Top Bar */}
      <header className="home-header">
        <div className="brand-title">
          <Shield size={24} style={{ color: 'var(--gold-primary)' }} />
          <span>THE WITCHER JOURNAL</span>
        </div>
        <div className="home-header-right">
          <button className="audio-toggle-btn" onClick={onToggleAudio}>
            {isAudioPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{isAudioPlaying ? 'SOUND ON' : 'SOUND MUTED'}</span>
          </button>
          <div className="clerk-auth-container">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="witcher-auth-btn">SIGN IN</button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton showName />
            </Show>
          </div>
        </div>
      </header>

      {/* Main HUD Overlays: Geralt Player Stats (Top Left) & Quest Tracker (Top Right) */}
      <div className="game-hud-overlay">
        {/* Geralt Player Vitals HUD (Top Left) */}
        <div className="hud-vitals-widget" onClick={handleOpen} title="Click to view stats in Journal">
          <div className="hud-level-badge">
            <span className="hud-lvl-lbl">LVL</span>
            <span className="hud-lvl-val">{playerLevel}</span>
          </div>
          <div className="hud-vitals-info">
            <div className="hud-stat-row">
              <Coins size={14} style={{ color: 'var(--gold-primary)' }} />
              <span className="hud-stat-val">{crowns} Crowns</span>
            </div>
            <div className="hud-stat-row">
              <Package size={14} style={{ color: 'var(--text-dim)' }} />
              <span className="hud-stat-val">{completedQuestsCount} / {totalQuestsCount} Quests Done</span>
            </div>
          </div>
        </div>

        {/* Witcher 3 In-Game Quest Tracker HUD (Top Right) */}
        <div className="hud-quest-tracker-widget" onClick={handleOpen} title="Click to open tracked quest in Journal">
          <div className="hud-tracker-header">
            <div className="hud-tracker-icon">
              <Compass size={18} style={{ color: 'var(--gold-bright)' }} />
            </div>
            <div className="hud-tracker-meta">
              <div className="hud-quest-category">
                {trackedQuest ? trackedQuest.category.toUpperCase() : 'ACTIVE TRACKER'}
              </div>
              <div className="hud-quest-title">
                {trackedQuest ? trackedQuest.title : 'NO QUEST TRACKED'}
              </div>
              {trackedQuest?.locationTag && (
                <div className="hud-quest-location">
                  <MapPin size={11} style={{ marginRight: 3, display: 'inline' }} />
                  {trackedQuest.locationTag}
                </div>
              )}
            </div>
          </div>

          <div className="hud-tracker-body">
            {renderTrackedObjectives()}
          </div>
          
          <div className="hud-tracker-hint">
            <span>[SPACE] TOGGLE TRACKING IN JOURNAL</span>
          </div>
        </div>
      </div>

      {/* Bottom HUD Bar: Meditate + Notice Board */}
      <div className="hud-bottom-bar">
        {onMeditate && (
          <button className="hud-meditate-btn" onClick={() => { playClickSound(); onMeditate(); }}>
            <Flame size={16} /> MEDITATE
          </button>
        )}
        {onOpenNoticeBoard && (
          <button className="hud-notice-btn" onClick={() => { playClickSound(); onOpenNoticeBoard(); }}>
            <ScrollText size={16} /> NOTICES{noticeCount > 0 ? ` (${noticeCount})` : ''}
          </button>
        )}
      </div>

      {/* Center Main Action */}
      <main className="home-main">
        <div className="home-tagline">GERALT'S PRODUCTIVITY JOURNAL</div>
        <button className="quests-entry-btn corner-brackets" onClick={handleOpen}>
          <Sparkles size={20} style={{ display: 'inline', marginRight: '0.75rem' }} />
          OPEN JOURNAL
          <Sparkles size={20} style={{ display: 'inline', marginLeft: '0.75rem' }} />
        </button>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        PRESS "OPEN JOURNAL" OR 'ESC' AT ANY TIME TO NAVIGATE QUESTS, BESTIARY & GLOSSARY
      </footer>
    </div>
  );
};

