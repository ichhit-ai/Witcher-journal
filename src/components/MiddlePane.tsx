import React from 'react';
import { Shield, Edit3 } from 'lucide-react';
import type { Quest } from '../types';
import { playClickSound } from '../services/soundSynth';

interface MiddlePaneProps {
  quest: Quest | null;
  onToggleObjective: (questId: string, objectiveId: string, subQuestId?: string) => void;
  onEditQuest: (quest: Quest) => void;
}

export const MiddlePane: React.FC<MiddlePaneProps> = ({
  quest,
  onToggleObjective,
  onEditQuest,
}) => {
  if (!quest) {
    return (
      <div className="middle-pane" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-title)', fontSize: '0.8rem', letterSpacing: '2px' }}>
          SELECT A QUEST
        </div>
      </div>
    );
  }

  // Extract just the location name (before any | separator)
  const locationName = quest.locationTag.split('|')[0].trim();

  return (
    <div className="middle-pane">
      {/* Header — flat, no corner brackets, matching in-game */}
      <div className="quest-detail-header">
        <div className="detail-header-row">
          <div className="detail-crest">
            <Shield size={24} />
          </div>
          <div className="detail-info">
            <div className="detail-title">{quest.title}</div>
            <div className="detail-location">{locationName}</div>
            {quest.suggestedLevel && (
              <div className="detail-suggested-level">
                SUGGESTED LEVEL {quest.suggestedLevel}
              </div>
            )}
          </div>
          <button
            className="detail-edit-btn"
            onClick={() => { playClickSound(); onEditQuest(quest); }}
            title="Edit Quest"
          >
            <Edit3 size={14} />
          </button>
        </div>
      </div>

      {/* Objectives */}
      <div className="objectives-section">
        {quest.subQuests && quest.subQuests.length > 0 ? (
          quest.subQuests.map((subQ) => (
            <div className="subquest-block" key={subQ.id}>
              <div className="subquest-title">{subQ.title}</div>
              {subQ.objectives.map((obj) => (
                <div
                  key={obj.id}
                  className="objective-row"
                  onClick={() => onToggleObjective(quest.id, obj.id, subQ.id)}
                >
                  <div className={`obj-icon ${obj.isCompleted ? 'completed' : 'pending'}`}>
                    {obj.isCompleted ? '✓' : '●'}
                  </div>
                  <div className={`obj-text ${obj.isCompleted ? 'completed' : ''}`}>
                    {obj.text}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="subquest-block">
            {quest.objectives.map((obj) => (
              <div
                key={obj.id}
                className="objective-row"
                onClick={() => onToggleObjective(quest.id, obj.id)}
              >
                <div className={`obj-icon ${obj.isCompleted ? 'completed' : 'pending'}`}>
                  {obj.isCompleted ? '✓' : '●'}
                </div>
                <div className={`obj-text ${obj.isCompleted ? 'completed' : ''}`}>
                  {obj.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom hint bar — matches in-game "Space  Track Quest" */}
      <div className="track-hint">
        <span className="track-hint-key">Space</span>
        <span>{quest.isTracked ? 'Untrack Quest' : 'Track Quest'}</span>
      </div>
    </div>
  );
};
