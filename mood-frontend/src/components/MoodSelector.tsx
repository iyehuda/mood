import { useState } from 'react';
import type { Mood } from '../services/api';
import '../styles/MoodSelector.css';

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
  onCustomPrompt: (prompt: string) => void;
  isLoading?: boolean;
}

const moods: { type: Mood; label: string; color: string }[] = [
  { type: 'happy', label: 'Happy', color: '#FFD700' },
  { type: 'sad', label: 'Sad', color: '#4682B4' },
  { type: 'energetic', label: 'Energetic', color: '#FF4500' },
  { type: 'calm', label: 'Calm', color: '#98FB98' },
  { type: 'romantic', label: 'Romantic', color: '#FF69B4' },
  { type: 'angry', label: 'Angry', color: '#DC143C' },
  { type: 'focused', label: 'Focused', color: '#9370DB' },
  { type: 'party', label: 'Party', color: '#FF8C00' },
];

export const MoodSelector = ({ onMoodSelect, onCustomPrompt, isLoading = false }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onCustomPrompt(customPrompt.trim());
      setCustomPrompt('');
    }
  };

  return (
    <div className="mood-selector-container">
      <div className="mood-buttons-row">
        {moods.map((mood) => (
          <button
            key={mood.type}
            className={`mood-button ${selectedMood === mood.type ? 'selected' : ''} ${
              isLoading ? 'disabled' : ''
            }`}
            style={{ backgroundColor: mood.color }}
            onClick={() => handleMoodClick(mood.type)}
            disabled={isLoading}
          >
            {mood.label}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleCustomPromptSubmit} className="custom-prompt-form">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Or describe your mood in your own words..."
          className="custom-prompt-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="custom-prompt-button"
          disabled={isLoading || !customPrompt.trim()}
        >
          Generate
        </button>
      </form>
    </div>
  );
}; 