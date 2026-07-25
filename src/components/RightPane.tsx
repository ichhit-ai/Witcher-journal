import React from 'react';
import { FileText } from 'lucide-react';
import type { Quest } from '../types';

interface RightPaneProps {
  quest: Quest | null;
}

export const RightPane: React.FC<RightPaneProps> = ({ quest }) => {
  if (!quest) {
    return (
      <div className="right-pane" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-title)', fontSize: '0.8rem', letterSpacing: '2px' }}>
          SELECT A QUEST TO READ ITS JOURNAL ENTRY
        </div>
      </div>
    );
  }

  const paragraphs = quest.loreText ? quest.loreText.split('\n\n') : [];

  return (
    <div className="right-pane">
      {/* No header — lore text starts immediately, matching in-game */}
      <div className="lore-content">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="lore-paragraph">
            {p}
          </p>
        ))}
      </div>

      {/* Decorative parchment/document watermark — subtle document icon */}
      <div className="seal-watermark">
        <FileText size={160} style={{ color: 'var(--text-faint)' }} />
      </div>
    </div>
  );
};
