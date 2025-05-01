import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { GeneratePlaylistPage } from "./pages/GeneratePlaylistPage.tsx";
import { LoginPage } from "./pages/LoginPage";
import { CallbackPage } from "./pages/CallbackPage";
import { Box, CircularProgress } from "@mui/material";
import "./App.css";
import { useAuth } from "./context/useAuth.tsx";

function App() {
  const { isAuthenticated, checkingAuth } = useAuth();

  if (checkingAuth) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <GeneratePlaylistPage /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
