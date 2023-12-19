import { BrowserRouter } from "react-router-dom";
import TopBar from "./components/TopBar";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import BottomBar from "./components/BottomBar";
import Clienti from "./components/Clienti";
import Forniture from "./components/Forniture";
import Letture from "./components/Letture";
import Oneri from "./components/Oneri";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import AddLetturaModal from "./components/modals/AddLetturaModal";
import UploadFlussiModal from "./components/modals/UploadFlussiModal";
import DeleteLetturaModal from "./components/modals/DeleteLetturaModal";
import AddOneriModal from "./components/modals/AddOneriModal";

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
        <Route path="/oneri" element={<Oneri />} />
      </Routes>
      <BottomBar />
      <UploadFlussiModal />
      <AddLetturaModal />
      <DeleteLetturaModal />
      <AddOneriModal />
    </BrowserRouter>
  );
}

export default App;
