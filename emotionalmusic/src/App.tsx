import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ResultPage from "./pages/ResultPage";
import GPTAnalysisPage from "./pages/GPTAnalysisPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import MusicBoardPage from "./pages/MusicBoardPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/result/:emotion" element={<ResultPage />} />
          <Route path="/analysis/:diaryText" element={<GPTAnalysisPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/music-board" element={<MusicBoardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
