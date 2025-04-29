export type Mood =
  | "happy"
  | "sad"
  | "energetic"
  | "calm"
  | "romantic"
  | "angry"
  | "focused"
  | "party";

export const moodColors: Record<Mood, string> = {
  happy: "#FFD700",
  sad: "#4682B4",
  energetic: "#FF4500",
  calm: "#98FB98",
  romantic: "#FF69B4",
  angry: "#DC143C",
  focused: "#9370DB",
  party: "#FF8C00",
};

export function getMoodColor(mood: string) {
  const defaultColor = "#ffffff";

  return moodColors[mood as Mood] || defaultColor;
}
