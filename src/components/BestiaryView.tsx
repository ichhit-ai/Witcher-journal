import React, { useState } from 'react';
import { Skull, ShieldAlert, Zap, Plus } from 'lucide-react';
import type { BestiaryEntry } from '../types';
import { playClickSound, playObjectiveSound } from '../services/soundSynth';

interface BestiaryViewProps {
  entries: BestiaryEntry[];
  onDefeatMonster: (entryId: string) => void;
  onAddEntry: (entry: BestiaryEntry) => void;
}

export const BestiaryView: React.FC<BestiaryViewProps> = ({
  entries,
  onDefeatMonster,
  onAddEntry,
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string>(entries[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);

  // New monster entry form state
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [weaknessStr, setWeaknessStr] = useState('');
  const [description, setDescription] = useState('');
  const [tactics, setTactics] = useState('');

  const selectedEntry = entries.find((e) => e.id === selectedEntryId) || entries[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEntry: BestiaryEntry = {
      id: `best-${Date.now()}`,
      name: name.toUpperCase(),
      category: 'Habit Blocker',
      subtitle: subtitle.toUpperCase() || 'DISTRACTION BLOCKER',
      weaknesses: weaknessStr.split(',').map((s) => s.trim()).filter(Boolean),
      description,
      tactics,
      victoriesCount: 0,
      iconType: 'ghoul',
    };

    onAddEntry(newEntry);
    setSelectedEntryId(newEntry.id);
    setShowAddModal(false);
    setName('');
    setSubtitle('');
    setWeaknessStr('');
    setDescription('');
    setTactics('');
  };

  return (
    <div className="journal-body" style={{ gridTemplateColumns: '320px 1fr' }}>
      {/* Left List of Monsters */}
      <div className="left-pane">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', letterSpacing: '3px', color: 'var(--gold-bright)' }}>
            BESTIARY & HABITS
          </div>
          <button
            className="btn-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            onClick={() => {
              playClickSound();
              setShowAddModal(true);
            }}
          >
            <Plus size={14} /> NEW
          </button>
        </div>

        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`quest-item ${entry.id === selectedEntryId ? 'selected' : ''}`}
            onClick={() => {
              playClickSound();
              setSelectedEntryId(entry.id);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Skull size={18} style={{ color: 'var(--red-accent)' }} />
              <div>
                <div className="quest-item-title">{entry.name}</div>
                <div className="quest-item-subtitle">{entry.subtitle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Detail Pane */}
      <div className="right-pane" style={{ padding: '3rem' }}>
        {selectedEntry ? (
          <div style={{ maxWidth: '750px' }}>
            <div className="corner-brackets" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Skull size={36} style={{ color: 'var(--red-accent)' }} />
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', letterSpacing: '3px', color: 'var(--text-bright)' }}>
                      {selectedEntry.name}
                    </h2>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', letterSpacing: '2px', color: 'var(--gold-primary)' }}>
                      {selectedEntry.subtitle}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>VICTORIES SLAYED</div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', color: 'var(--green-check)', fontWeight: 700 }}>
                    {selectedEntry.victoriesCount}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '1.25rem' }}>
                <button
                  className="btn-gold"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => {
                    playObjectiveSound();
                    onDefeatMonster(selectedEntry.id);
                  }}
                >
                  <Zap size={18} /> SLAY HABIT MONSTER (+1 VICTORY)
                </button>
              </div>
            </div>

            {/* Weaknesses */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--gold-bright)', marginBottom: '0.75rem' }}>
                KNOWN WEAKNESSES & POTIONS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedEntry.weaknesses.map((w, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(201, 151, 79, 0.12)',
                      border: '1px solid var(--gold-primary)',
                      color: 'var(--gold-bright)',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-title)',
                      letterSpacing: '1px',
                    }}
                  >
                    • {w}
                  </span>
                ))}
              </div>
            </div>

            {/* Lore Description */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                LORE & BEHAVIOR
              </div>
              <p className="lore-paragraph">{selectedEntry.description}</p>
            </div>

            {/* Tactics */}
            <div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--gold-bright)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} /> COMBAT TACTICS
              </div>
              <p className="lore-paragraph">{selectedEntry.tactics}</p>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-title)' }}>NO BESTIARY ENTRY SELECTED</div>
        )}
      </div>

      {/* Add Monster Entry Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--font-title)', letterSpacing: '3px', color: 'var(--gold-bright)', marginBottom: '1.5rem' }}>
              ADD BESTIARY HABIT MONSTER
            </h2>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">MONSTER NAME</label>
                <input className="form-input" placeholder="e.g. THE PROCRASTINATION GHOUL" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">SUBTITLE / TYPE</label>
                <input className="form-input" placeholder="e.g. TEMPTRESS OF DEADLINES" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">WEAKNESSES (comma separated)</label>
                <input className="form-input" placeholder="e.g. 25-Min Pomodoro, Website Blocker, Walk" value={weaknessStr} onChange={(e) => setWeaknessStr(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">DESCRIPTION</label>
                <textarea className="form-textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">TACTICS</label>
                <textarea className="form-textarea" rows={3} value={tactics} onChange={(e) => setTactics(e.target.value)} />
              </div>
              <div className="btn-row">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>CANCEL</button>
                <button type="submit" className="btn-gold">ADD TO BESTIARY</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
