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
import AddLetturaModal from "./components/modals/AddLetturaModal";
import UploadFlussiModal from "./components/modals/UploadFlussiModal";
import DeleteLetturaModal from "./components/modals/DeleteLetturaModal";

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
      <UploadFlussiModal />
      <AddLetturaModal />
      <DeleteLetturaModal />
    </BrowserRouter>
  );
}

export default App;
