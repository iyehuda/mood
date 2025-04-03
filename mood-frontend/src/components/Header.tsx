import '../styles/Header.css';
import { type Mood } from '../services/api';

interface HeaderProps {
  onSpotifyLogin: () => void;
  currentMood: Mood | null;
  customPrompt: string;
}

export const Header = ({ onSpotifyLogin, currentMood, customPrompt }: HeaderProps) => {
  const getTitleColor = () => {
    if (customPrompt) return '#ffffff';
    if (!currentMood) return '#ffffff';
    
    const moodColors: Record<Mood, string> = {
      happy: '#FFD700',
      sad: '#4682B4',
      angry: '#FF4500',
      energetic: '#FF69B4',
      calm: '#98FB98',
      romantic: '#FF69B4',
      nostalgic: '#DDA0DD',
      focused: '#87CEEB',
      sleepy: '#B0C4DE',
      party: '#FF1493'
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
        <div className="title-underline" style={{ background: `linear-gradient(90deg, ${getTitleColor()}, ${getTitleColor()}80)` }}></div>
      </div>
      <button className="spotify-login-button" onClick={onSpotifyLogin}>
        <svg className="spotify-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        Connect with Spotify
      </button>
    </header>
  );
};