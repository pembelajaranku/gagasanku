import React, { useEffect } from 'react';
import { ModalPayload } from '../types/game';

interface FeedbackModalProps {
  modal: ModalPayload | null;
  onClose: () => void;
}

export function FeedbackModal({ modal, onClose }: FeedbackModalProps) {
  useEffect(() => {
    if (!modal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modal, onClose]);

  if (!modal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#4B3F6B]/45 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-7 max-w-md w-full text-center shadow-2xl border border-[#EDE6FF] animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-2" aria-hidden="true">
          {modal.icon}
        </div>
        <h2 id="feedback-modal-title" className="text-2xl font-extrabold text-[#4B3F6B] mb-2">
          {modal.title}
        </h2>
        <p className="text-[#5D5182] leading-relaxed mb-6">{modal.message}</p>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] px-7 py-2.5 rounded-full font-['Baloo_2'] font-bold text-base text-white bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] shadow-md hover:brightness-105 active:scale-95 transition-transform cursor-pointer"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}
