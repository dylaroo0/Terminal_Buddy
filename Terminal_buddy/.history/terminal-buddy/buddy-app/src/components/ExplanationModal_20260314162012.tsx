import React, { useEffect, useRef } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { ReadAloudButton } from './ReadAloudButton';
import type { Explanation } from '../utils/tauri-mcp';

interface ExplanationModalProps {
  commandInput: string;
  explanation: Explanation;
  loading?: boolean;
  onClose: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  commandInput,
  explanation,
  loading = false,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="explanation-overlay" onClick={handleBackdropClick}>
      <div className="explanation-modal" ref={modalRef} role="dialog" aria-modal="true">
        <div className="explanation-header">
          <div className="explanation-title">
            <Lightbulb size={20} />
            <h3>Explanation</h3>
          </div>
          <button onClick={onClose} className="explanation-close" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="explanation-command">
          <code>{commandInput}</code>
        </div>

        <div className="explanation-body">
          {loading ? (
            <div className="explanation-loading">
              <div className="spinner"></div>
              <p>Thinking...</p>
            </div>
          ) : (
            <p>{explanation.explanation}</p>
          )}
        </div>

        {!loading && explanation.confidence < 0.5 && (
          <div className="explanation-warning">
            Low confidence — this explanation may be incomplete. Check your API key configuration.
          </div>
        )}
      </div>
    </div>
  );
};
