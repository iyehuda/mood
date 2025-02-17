import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import HelloWorldPage from "./pages/HelloWorldPage";
import { darkTheme } from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <HelloWorldPage />
    </ThemeProvider>
  );
}

export default App;
