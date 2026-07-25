import React, { useState } from 'react';
import { BookOpen, Scroll, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { GlossaryDoc } from '../types';
import { playClickSound } from '../services/soundSynth';

interface JournalViewProps {
  docs: GlossaryDoc[];
  onAddDoc: (doc: GlossaryDoc) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ docs, onAddDoc }) => {
  const [docIndex, setDocIndex] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Lore' | 'Personal Notes' | 'Reflections' | 'Project Spec'>('Personal Notes');
  const [content, setContent] = useState('');

  const currentDoc = docs[docIndex] || docs[0];

  const handlePrev = () => {
    playClickSound();
    setDocIndex((prev) => (prev > 0 ? prev - 1 : docs.length - 1));
  };

  const handleNext = () => {
    playClickSound();
    setDocIndex((prev) => (prev < docs.length - 1 ? prev + 1 : 0));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDoc: GlossaryDoc = {
      id: `doc-${Date.now()}`,
      title: title.toUpperCase(),
      category,
      dateCreated: new Date().toISOString().split('T')[0],
      icon: 'book',
      content,
    };

    onAddDoc(newDoc);
    setDocIndex(docs.length); // select new doc
    setShowAddModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="journal-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020203' }}>
      {/* Document Reader Frame (Replicating Image 4 screenshot UI) */}
      <div
        className="corner-brackets"
        style={{
          width: '780px',
          maxHeight: '82vh',
          background: '#07070a',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 50px rgba(0,0,0,0.9)',
        }}
      >
        {/* Reader Top Bar (Page count & Document Tabs) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--gold-hairline)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="close-btn" style={{ width: '30px', height: '30px' }} onClick={handlePrev}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--text-dim)' }}>
              {docIndex + 1} / {docs.length}
            </span>
            <button className="close-btn" style={{ width: '30px', height: '30px' }} onClick={handleNext}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Document Tab Strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {docs.map((d, idx) => (
              <div
                key={d.id}
                onClick={() => {
                  playClickSound();
                  setDocIndex(idx);
                }}
                style={{
                  cursor: 'pointer',
                  padding: '0.3rem 0.6rem',
                  border: idx === docIndex ? '1px solid var(--gold-primary)' : '1px solid var(--gold-hairline)',
                  background: idx === docIndex ? 'rgba(201, 151, 79, 0.15)' : 'transparent',
                  color: idx === docIndex ? 'var(--gold-bright)' : 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {d.category === 'Lore' ? <BookOpen size={14} /> : <Scroll size={14} />}
              </div>
            ))}
          </div>

          <button
            className="btn-secondary"
            style={{ padding: '0.3rem 0.7rem', fontSize: '0.85rem' }}
            onClick={() => {
              playClickSound();
              setShowAddModal(true);
            }}
          >
            <Plus size={14} /> NEW ENTRY
          </button>
        </div>

        {/* Reader Document Header */}
        {currentDoc ? (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', letterSpacing: '4px', color: 'var(--text-bright)' }}>
                {currentDoc.title}
              </h1>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.9rem', letterSpacing: '2px', color: 'var(--gold-primary)', marginTop: '0.25rem' }}>
                {currentDoc.category.toUpperCase()} • ENTRY DATE: {currentDoc.dateCreated}
              </div>
            </div>

            {/* Document Content Text */}
            <div style={{ maxWidth: '650px', margin: '0 auto' }}>
              {currentDoc.content.split('\n\n').map((para, idx) => (
                <p key={idx} className="lore-paragraph" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-faint)', textAlign: 'center' }}>NO DOCUMENTS FOUND</div>
        )}
      </div>

      {/* Add Document Entry Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--font-title)', letterSpacing: '3px', color: 'var(--gold-bright)', marginBottom: '1.5rem' }}>
              WRITE GLOSSARY / JOURNAL ENTRY
            </h2>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">DOCUMENT TITLE</label>
                <input className="form-input" placeholder="e.g. THE WITCHER PATH NOTES" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">CATEGORY</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                  <option value="Personal Notes">Personal Notes</option>
                  <option value="Lore">Lore</option>
                  <option value="Reflections">Reflections</option>
                  <option value="Project Spec">Project Spec</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">ENTRY CONTENT</label>
                <textarea className="form-textarea" rows={8} placeholder="Write your lore or personal notes here..." value={content} onChange={(e) => setContent(e.target.value)} required />
              </div>
              <div className="btn-row">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>CANCEL</button>
                <button type="submit" className="btn-gold">SAVE ENTRY</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
