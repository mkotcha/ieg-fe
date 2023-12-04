import { BrowserRouter } from "react-router-dom";
import TopBar from "./components/TopBar";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import BottomBar from "./components/BottomBar";
import Clienti from "./components/Clienti";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clienti" element={<Clienti />} />
      </Routes>
      <BottomBar />
    </BrowserRouter>
  );
}

export default App;
