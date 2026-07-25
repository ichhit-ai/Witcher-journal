import React, { useState } from 'react';
import { Sparkles, Trash2, Plus } from 'lucide-react';
import type { Quest, QuestCategory, SubQuest } from '../types';

interface QuestEditorModalProps {
  questToEdit?: Quest | null;
  onSave: (quest: Quest) => void;
  onClose: () => void;
}

export const QuestEditorModal: React.FC<QuestEditorModalProps> = ({
  questToEdit,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(questToEdit?.title || '');
  const [locationTag, setLocationTag] = useState(questToEdit?.locationTag || 'NOVIGRAD | WORK');
  const [category, setCategory] = useState<QuestCategory>(questToEdit?.category || 'Main Quest');
  const [suggestedLevel, setSuggestedLevel] = useState<number>(questToEdit?.suggestedLevel || 3);
  const [points, setPoints] = useState<number>(questToEdit?.points || 100);
  const [loreText, setLoreText] = useState(questToEdit?.loreText || '');

  // SubQuests & Objectives State
  const [subQuests, setSubQuests] = useState<SubQuest[]>(questToEdit?.subQuests || []);
  const [objectivesText, setObjectivesText] = useState<string>(
    questToEdit?.objectives?.map((o) => o.text).join('\n') || 'Inspect the task requirements.\nExecute the implementation.\nVerify the results.'
  );

  // Auto Witcher Voice generator helper
  const handleAutoGenerateLore = () => {
    if (!title.trim()) return;

    let generated = '';
    if (category === 'Witcher Contract') {
      generated = `Word reached the notice board of a trouble brewing in ${locationTag.split('|')[0] || 'the village'}. ${title} required immediate attention before dire consequences were wrought upon the realm.\n\nGeralt agreed to accept the contract for a fair sum of crowns.`;
    } else if (category === 'Main Quest') {
      generated = `A vital saga unfolded concerning ${title}. Geralt knew that to forge ahead in his journey, this objective in ${locationTag.split('|')[0] || 'the realm'} could not be left unattended.\n\nHe prepared his blades and gathered his wits for what was to come.`;
    } else if (category === 'Treasure Hunt') {
      generated = `While exploring ${locationTag.split('|')[0] || 'the ruins'}, Geralt uncovered an old note detailing a forgotten stash tied to ${title}.\n\nHe set forth to unearth the hidden reward.`;
    } else {
      generated = `A peculiar request was made regarding ${title} in ${locationTag.split('|')[0] || 'the local district'}.\n\nThough a secondary concern, the witcher resolved to see it through to completion.`;
    }

    setLoreText(generated);
  };

  const handleAddSubQuest = () => {
    const newSub: SubQuest = {
      id: `sub-${Date.now()}`,
      title: 'New Subquest Stage',
      locationTag: 'SUBQUEST',
      isCompleted: false,
      objectives: [
        { id: `obj-${Date.now()}-1`, text: 'First subquest step', isCompleted: false, sortOrder: 1 },
      ],
    };
    setSubQuests([...subQuests, newSub]);
  };

  const handleRemoveSubQuest = (idx: number) => {
    setSubQuests(subQuests.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse top-level objectives text
    const parsedTopObjectives = objectivesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => ({
        id: `obj-${Date.now()}-${idx}`,
        text: line,
        isCompleted: false,
        sortOrder: idx + 1,
      }));

    const finalQuest: Quest = {
      id: questToEdit?.id || `quest-${Date.now()}`,
      title: title.toUpperCase(),
      locationTag: locationTag.toUpperCase(),
      category,
      suggestedLevel,
      status: questToEdit?.status || 'Active',
      isTracked: questToEdit?.isTracked || false,
      points: Number(points) || 100,
      sortOrder: questToEdit?.sortOrder || 1,
      loreText,
      subQuests,
      objectives: parsedTopObjectives,
    };

    onSave(finalQuest);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-title)', letterSpacing: '3px', color: 'var(--gold-bright)', marginBottom: '1.5rem' }}>
          {questToEdit ? 'EDIT QUEST & SUBQUESTS' : 'POST NOTICE — NEW QUEST'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Title & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">QUEST TITLE</label>
              <input className="form-input" placeholder="e.g. LILAC AND GOOSEBERRIES" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">CATEGORY</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value as QuestCategory)}>
                <option value="Main Quest">Main Quest (100 XP)</option>
                <option value="Secondary Quest">Secondary Quest (50 XP)</option>
                <option value="Witcher Contract">Witcher Contract (30 XP)</option>
                <option value="Treasure Hunt">Treasure Hunt (40 XP)</option>
              </select>
            </div>
          </div>

          {/* Location & XP */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">LOCATION / PROJECT TAG</label>
              <input className="form-input" placeholder="e.g. NOVIGRAD | WORK" value={locationTag} onChange={(e) => setLocationTag(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">SUGGESTED LEVEL</label>
              <input className="form-input" type="number" value={suggestedLevel} onChange={(e) => setSuggestedLevel(Number(e.target.value))} />
            </div>

            <div className="form-group">
              <label className="form-label">XP REWARD POINTS</label>
              <input className="form-input" type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
            </div>
          </div>

          {/* Objectives List */}
          <div className="form-group">
            <label className="form-label">OBJECTIVES (one step per line)</label>
            <textarea className="form-textarea" rows={3} value={objectivesText} onChange={(e) => setObjectivesText(e.target.value)} placeholder="Step 1&#10;Step 2&#10;Step 3" />
          </div>

          {/* SubQuests Section */}
          <div className="form-group" style={{ borderTop: '1px dashed var(--gold-hairline)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="form-label">NESTED SUBQUESTS ({subQuests.length})</label>
              <button type="button" className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={handleAddSubQuest}>
                <Plus size={14} /> ADD SUBQUEST
              </button>
            </div>

            {subQuests.map((sq, idx) => (
              <div key={sq.id} style={{ background: '#0d0d10', border: '1px solid var(--gold-hairline)', padding: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    className="form-input"
                    value={sq.title}
                    onChange={(e) => {
                      const updated = [...subQuests];
                      updated[idx].title = e.target.value;
                      setSubQuests(updated);
                    }}
                    placeholder="Subquest title..."
                  />
                  <button type="button" className="close-btn" onClick={() => handleRemoveSubQuest(idx)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Lore Text & Auto-Generator */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label className="form-label">JOURNAL LORE PROSE</label>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', color: 'var(--gold-bright)', borderColor: 'var(--gold-primary)' }}
                onClick={handleAutoGenerateLore}
              >
                <Sparkles size={14} /> WITCHER VOICE GENERATOR
              </button>
            </div>
            <textarea className="form-textarea" rows={4} value={loreText} onChange={(e) => setLoreText(e.target.value)} placeholder="Journal narrative text..." />
          </div>

          {/* Buttons */}
          <div className="btn-row">
            <button type="button" className="btn-secondary" onClick={onClose}>
              CANCEL
            </button>
            <button type="submit" className="btn-gold">
              SAVE QUEST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
