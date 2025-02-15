import moodLogo from "../assets/mood.svg";
import moodDarkLogo from "../assets/mood-dark.svg";

function Logo() {
  return (
    <picture>
      <source srcSet={moodDarkLogo} media="(prefers-color-scheme: dark)" />
      <img src={moodLogo} alt="Mood Logo" />
    </picture>
  );
}

export default Logo;
