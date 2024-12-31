import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import HomePage from "./pages/HomePage";
import AdminViewPromptPage from "./pages/AdminViewPromptPage";
import AgreeFUQPage from "./pages/AgreeFUQPage";
import DisagreeFUQPage from "./pages/DisagreeFUQPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrimaryQPage from "./pages/PrimaryQPage";
import WaitPage from "./pages/WaitPage";
import GameEndPage from "./pages/GameEndPage";
import AboutPage from "./pages/AboutPage";
import AdminJoinGamePage from "./pages/AdminJoinGamePage"
import { SocketProvider } from './components/SocketContext';

function App() {

  return (
    <SocketProvider>
    <BrowserRouter>
      <div className="App">
        <h1>
          <NavBar />
        </h1>
        <div id="page-body">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route
              path="/admin/join/:gameId"
              element={<AdminJoinGamePage />}
            ></Route>
            <Route
              path="/:userId/admin"
              element={<AdminViewPromptPage />}
            ></Route>
            <Route
              path="/agree/:userId/:agreeResponseId"
              element={<AgreeFUQPage />}
            ></Route>
            <Route
              path="/disagree/:userId/:disagreeResponseId"
              element={<DisagreeFUQPage />}
            ></Route>
            <Route
              path="/primary/:userId/:questionId"
              element={<PrimaryQPage />}
            ></Route>
            <Route path="/wait/:userId" element={<WaitPage />}></Route>
            <Route path="/end/:userId" element={<GameEndPage />}></Route>
            <Route path="/about" element={<AboutPage />}></Route>
            <Route path='*' element={<NotFoundPage />}></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
