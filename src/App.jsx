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
import DeleteOneriModal from "./components/modals/DeleteOneriModal";
import AddDispacciamentoModal from "./components/modals/AddDispacciamentoModal";
import DeleteDispacciamentoModal from "./components/modals/DeleteDispacciamentoModal";
import Fornitura from "./components/Fornitura";
import Cliente from "./components/Cliente";
import AddClienteModal from "./components/modals/AddClienteModal";
import DeleteClienteModal from "./components/modals/DeleteClienteModal";
import DeleteFornituraModal from "./components/modals/DeleteFornituraModal";
import AddFornituraModal from "./components/modals/AddFornituraModal";

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clienti" element={<Clienti />} />
        <Route path="/cliente/:id" element={<Cliente />} />
        <Route path="/forniture" element={<Forniture />} />
        <Route path="/fornitura/:id" element={<Fornitura />} />
        <Route path="/letture/" element={<Letture />} />
        <Route path="/letture/:pod" element={<Letture />} />
        <Route path="/oneri" element={<Oneri />} />
      </Routes>
      <BottomBar />
      <UploadFlussiModal />
      <AddLetturaModal />
      <DeleteLetturaModal />
      <AddOneriModal />
      <DeleteOneriModal />
      <AddDispacciamentoModal />
      <DeleteDispacciamentoModal />
      <AddClienteModal />
      <AddFornituraModal />
      <DeleteClienteModal />
      <DeleteFornituraModal />
    </BrowserRouter>
  );
}

export default App;
