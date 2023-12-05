import { BrowserRouter } from "react-router-dom";
import TopBar from "./components/TopBar";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import BottomBar from "./components/BottomBar";
import Clienti from "./components/Clienti";
import Forniture from "./components/Forniture";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Letture from "./components/Letture";

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clienti" element={<Clienti />} />
        <Route path="/forniture" element={<Forniture />} />
        <Route path="/letture" element={<Letture />} />
      </Routes>
      <BottomBar />
    </BrowserRouter>
  );
}

export default App;
