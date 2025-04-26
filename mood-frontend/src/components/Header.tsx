import "../styles/Header.css";
import { type Mood } from "../services/api";
import { useAuth } from "../context/AuthContext.tsx";

interface HeaderProps {
  currentMood: Mood | null;
  customPrompt: string;
}

export const Header = ({ currentMood, customPrompt }: HeaderProps) => {
  const { user } = useAuth();

  const getTitleColor = () => {
    if (customPrompt) return "#ffffff";
    if (!currentMood) return "#ffffff";

    const moodColors: Record<Mood, string> = {
      happy: "#FFD700",
      sad: "#4682B4",
      angry: "#FF4500",
      energetic: "#FF69B4",
      calm: "#98FB98",
      romantic: "#FF69B4",
      focused: "#87CEEB",
      party: "#FF1493",
    };

    return moodColors[currentMood];
  };

  return (
    <header className="header">
      <div className="title-container">
        <h1 className="title">
          <span className="title-letter">M</span>
          <span className="title-letter">o</span>
          <span className="title-letter">o</span>
          <span className="title-letter">d</span>
        </h1>
        {customPrompt ? (
          <div className="current-mood custom-prompt">{customPrompt}</div>
        ) : currentMood ? (
          <div className="current-mood">{currentMood}</div>
        ) : null}
        <div
          className="title-underline"
          style={{ background: `linear-gradient(90deg, ${getTitleColor()}, ${getTitleColor()}80)` }}
        ></div>
      </div>
      {user && (
        <div
          className="spotify-user-info"
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}
        >
          <span className="spotify-user-name" style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            {user.name}
          </span>
          <span className="spotify-user-email" style={{ color: "#666", fontSize: "0.9rem" }}>
            {user.email}
          </span>
        </div>
      )}
    </header>
  );
};
