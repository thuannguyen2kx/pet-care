'use client';

import { useState } from 'react';

import { getDefaultReaction, getReactionMeta, REACTIONS } from '@/features/reaction/config';
import type { ReactionType } from '@/features/reaction/domain/reaction-entity';
import { Button } from '@/shared/ui/button';

interface ReactionPickerProps {
  onReactionSelect: (reactionType: ReactionType) => void;
  currentReaction: ReactionType | null;
}

export function ReactionPicker({ onReactionSelect, currentReaction }: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultReaction = getDefaultReaction();
  return (
    <div className="group relative">
      <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} aria-label="Add reaction">
        <span className="text-xl">{getReactionMeta(currentReaction || defaultReaction).emoji}</span>
        <span className="sr-only">Add reaction</span>
      </Button>

      {isOpen && (
        <div
          className="bg-background border-border animate-in fade-in slide-in-from-bottom-2 absolute bottom-full left-0 z-50 mb-2 flex gap-1 rounded-full border p-2 shadow-lg"
          onMouseLeave={() => setIsOpen(false)}
        >
          {REACTIONS.map((reaction) => (
            <button
              key={reaction.type}
              onClick={() => {
                onReactionSelect(reaction.type);
                setIsOpen(false);
              }}
              className={`hover:bg-secondary rounded-full p-2 text-xl transition-all hover:scale-125 ${
                currentReaction === reaction.type ? 'bg-accent/10 scale-125' : ''
              }`}
              title={reaction.label}
              aria-label={reaction.label}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
