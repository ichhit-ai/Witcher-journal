import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Quest, QuestCategory } from '../types';
import { playClickSound } from '../services/soundSynth';

interface LeftPaneProps {
  quests: Quest[];
  selectedQuestId: string | null;
  onSelectQuest: (questId: string) => void;
  onOpenEditor: () => void;
  playerLevel: number;
}

const CATEGORIES: QuestCategory[] = [
  'Main Quest',
  'Secondary Quest',
  'Witcher Contract',
  'Treasure Hunt',
];

const CATEGORY_LABELS: Record<string, string> = {
  'Main Quest': 'MAIN QUESTS',
  'Secondary Quest': 'SECONDARY QUESTS',
  'Witcher Contract': 'WITCHER CONTRACTS',
  'Treasure Hunt': 'TREASURE HUNTS',
};

export const LeftPane: React.FC<LeftPaneProps> = ({
  quests,
  selectedQuestId,
  onSelectQuest,
  onOpenEditor,
  playerLevel,
}) => {
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    'Main Quest': true,
    'Secondary Quest': false,
    'Witcher Contract': false,
    'Treasure Hunt': false,
  });
  const [completedExpanded, setCompletedExpanded] = useState(false);

  const toggleCat = (cat: string) => {
    playClickSound();
    setExpandedCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const allCompleted = quests.filter((q) => q.status === 'Completed');

  return (
    <div className="left-pane">
      <div className="left-pane-quests">
        {CATEGORIES.map((cat) => {
          const activeQuests = quests.filter((q) => q.category === cat && q.status === 'Active');
          const isExpanded = expandedCats[cat] ?? false;
          const count = activeQuests.length;

          if (count === 0 && !isExpanded) {
            // Still show the header even if empty
          }

          return (
            <div className="category-group" key={cat}>
              <div className="category-header" onClick={() => toggleCat(cat)}>
                <span>{CATEGORY_LABELS[cat]} ({count})</span>
                <span className={`category-caret ${isExpanded ? 'expanded' : 'collapsed'}`}>▼</span>
              </div>

              {isExpanded && activeQuests.map((q) => {
                const isSelected = q.id === selectedQuestId;
                const level = q.suggestedLevel || 1;
                const isSafe = level <= playerLevel;

                return (
                  <div
                    key={q.id}
                    className={`quest-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => { playClickSound(); onSelectQuest(q.id); }}
                  >
                    {/* Tracked exclamation mark */}
                    {q.isTracked && (
                      <span className="tracked-exclamation">!</span>
                    )}

                    {/* Level badge */}
                    <div className={`level-badge ${isSafe ? 'safe' : 'danger'}`}>
                      {level}
                    </div>

                    {/* Quest info — natural case title, location-only subtitle */}
                    <div className="quest-item-info">
                      <div className="quest-item-title">
                        {q.title}
                        {q.isRecurring && q.streakCount != null && q.streakCount > 0 && (
                          <span className="streak-badge" style={{ marginLeft: '0.5rem' }}>
                            <span className="streak-fire">🔥</span>{q.streakCount}
                          </span>
                        )}
                      </div>
                      <div className="quest-item-subtitle">
                        {q.locationTag.split('|')[0].trim()}
                        {q.isRecurring && (
                          <span className="recurring-badge" style={{ marginLeft: '0.4rem' }}>
                            ↻ {q.recurringFrequency}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Global COMPLETED section at the bottom */}
        {allCompleted.length > 0 && (
          <div className="completed-section">
            <div
              className="completed-section-header"
              onClick={() => { playClickSound(); setCompletedExpanded(!completedExpanded); }}
            >
              <span>COMPLETED ({allCompleted.length})</span>
              <span className={`category-caret ${completedExpanded ? 'expanded' : 'collapsed'}`}>▼</span>
            </div>

            {completedExpanded && allCompleted.map((q) => {
              const isSelected = q.id === selectedQuestId;
              return (
                <div
                  key={q.id}
                  className={`quest-item ${isSelected ? 'selected' : ''}`}
                  style={{ opacity: 0.5 }}
                  onClick={() => { playClickSound(); onSelectQuest(q.id); }}
                >
                  <div className="level-badge safe" style={{ opacity: 0.4 }}>
                    {q.suggestedLevel || 1}
                  </div>
                  <div className="quest-item-info">
                    <div className="quest-item-title" style={{ color: 'var(--text-dim)' }}>
                      {q.title}
                    </div>
                    <div className="quest-item-subtitle">
                      {q.locationTag.split('|')[0].trim()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post Notice button at bottom */}
      <div className="left-pane-footer">
        <button className="add-quest-btn" onClick={() => { playClickSound(); onOpenEditor(); }}>
          <Plus size={13} />
          POST NOTICE
        </button>
      </div>
    </div>
  );
};
