import React, { useState } from "react";
import "../styles/MoodSelector.css";
import { ActionButton } from "./buttons/ActionButton.tsx";
import { MoodButton } from "./buttons/MoodButton.tsx";
import { Mood, moodColors } from "./moods.ts";

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
  onCustomPrompt: (prompt: string) => void;
  isLoading?: boolean;
}

export const MoodSelector = ({
  onMoodSelect,
  onCustomPrompt,
  isLoading = false,
}: MoodSelectorProps) => {
  const [customPrompt, setCustomPrompt] = useState("");

  const handleMoodClick = (mood: Mood) => {
    onMoodSelect(mood);
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onCustomPrompt(customPrompt.trim());
      setCustomPrompt("");
    }
  };

  return (
    <div className="mood-selector-container">
      <div className="mood-buttons-row">
        {Object.entries(moodColors).map(([mood, color]) => (
          <MoodButton
            key={mood}
            sx={{ backgroundColor: color }}
            onClick={() => handleMoodClick(mood as Mood)}
            disabled={isLoading}
          >
            {mood}
          </MoodButton>
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
        <ActionButton type="submit" disabled={isLoading || !customPrompt.trim()}>
          Generate
        </ActionButton>
      </form>
    </div>
  );
};
