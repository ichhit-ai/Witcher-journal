import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Flame, Play, Pause, RotateCcw, Timer, Sparkles } from 'lucide-react';
import { playClickSound } from '../services/soundSynth';

interface MeditationTimerProps {
  onComplete: (minutesMeditated: number) => void;
  onCancel: () => void;
}

const PRESETS = [
  { label: '15 MIN', minutes: 15 },
  { label: '25 MIN', minutes: 25 },
  { label: '45 MIN', minutes: 45 },
  { label: '60 MIN', minutes: 60 },
];

export const MeditationTimer: React.FC<MeditationTimerProps> = ({ onComplete, onCancel }) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback((minutes: number) => {
    playClickSound();
    const secs = minutes * 60;
    setSelectedMinutes(minutes);
    setSecondsRemaining(secs);
    setTotalSeconds(secs);
    setIsRunning(true);
    setIsFinished(false);
  }, []);

  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsRemaining]);

  const togglePause = () => {
    playClickSound();
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    playClickSound();
    setIsRunning(false);
    setIsFinished(false);
    setSelectedMinutes(null);
    setSecondsRemaining(0);
    setTotalSeconds(0);
  };

  const handleComplete = () => {
    playClickSound();
    onComplete(selectedMinutes || 0);
  };

  const handleCancel = () => {
    playClickSound();
    if (intervalRef.current) clearInterval(intervalRef.current);
    onCancel();
  };

  // Format time display
  const displayMins = Math.floor(secondsRemaining / 60);
  const displaySecs = secondsRemaining % 60;
  const progressPct = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;

  // SVG ring calculations
  const RING_RADIUS = 120;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const ringOffset = RING_CIRCUMFERENCE - (progressPct / 100) * RING_CIRCUMFERENCE;

  return (
    <div className="meditation-overlay">
      <div className="meditation-backdrop" />

      {/* Close Button */}
      <button className="meditation-close-btn" onClick={handleCancel} title="Cancel Meditation">
        <X size={20} />
      </button>

      <div className="meditation-container">
        {/* Header */}
        <div className="meditation-header">
          <Flame size={22} style={{ color: 'var(--gold-bright)' }} />
          <span className="meditation-title">MEDITATION</span>
          <Flame size={22} style={{ color: 'var(--gold-bright)' }} />
        </div>
        <div className="meditation-subtitle">
          {isFinished
            ? 'Your mind is clear. Vitality restored.'
            : selectedMinutes
            ? 'Focus your mind. Let the world fall away...'
            : 'Choose your meditation duration, Witcher.'}
        </div>

        {/* Preset Selection (only before timer starts) */}
        {!selectedMinutes && (
          <div className="meditation-presets">
            {PRESETS.map((p) => (
              <button
                key={p.minutes}
                className="meditation-preset-btn"
                onClick={() => startTimer(p.minutes)}
              >
                <Timer size={16} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timer Ring */}
        {selectedMinutes && (
          <div className="meditation-timer-area">
            <div className="meditation-ring-container">
              <svg className="meditation-ring-svg" viewBox="0 0 280 280">
                {/* Background ring */}
                <circle
                  cx="140" cy="140" r={RING_RADIUS}
                  fill="none"
                  stroke="rgba(201, 151, 79, 0.12)"
                  strokeWidth="6"
                />
                {/* Progress ring */}
                <circle
                  cx="140" cy="140" r={RING_RADIUS}
                  fill="none"
                  stroke={isFinished ? '#4cd964' : 'var(--gold-bright)'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 140 140)"
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
                />
              </svg>

              {/* Center content */}
              <div className="meditation-ring-center">
                {isFinished ? (
                  <div className="meditation-complete-icon">
                    <Sparkles size={36} style={{ color: '#4cd964' }} />
                  </div>
                ) : (
                  <>
                    <div className="meditation-time-display">
                      {String(displayMins).padStart(2, '0')}:{String(displaySecs).padStart(2, '0')}
                    </div>
                    <div className="meditation-time-label">REMAINING</div>
                  </>
                )}
              </div>
            </div>

            {/* Vitality Bar */}
            <div className="meditation-vitality-section">
              <div className="meditation-vitality-label">VITALITY</div>
              <div className="meditation-vitality-bar-outer">
                <div
                  className="meditation-vitality-bar-inner"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="meditation-vitality-pct">{Math.round(progressPct)}%</div>
            </div>

            {/* Controls */}
            <div className="meditation-controls">
              {isFinished ? (
                <button className="meditation-action-btn complete" onClick={handleComplete}>
                  <Sparkles size={18} />
                  COLLECT FOCUS XP (+{Math.round((selectedMinutes || 0) * 2)} XP)
                </button>
              ) : (
                <>
                  <button className="meditation-action-btn" onClick={togglePause}>
                    {isRunning ? <Pause size={18} /> : <Play size={18} />}
                    {isRunning ? 'PAUSE' : 'RESUME'}
                  </button>
                  <button className="meditation-action-btn secondary" onClick={resetTimer}>
                    <RotateCcw size={16} />
                    RESET
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Campfire embers decoration */}
        <div className="meditation-embers">
          <div className="ember ember-1" />
          <div className="ember ember-2" />
          <div className="ember ember-3" />
        </div>
      </div>
    </div>
  );
};
