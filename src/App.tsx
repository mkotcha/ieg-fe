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
import Offerte from "./components/Offerte";
import AltrePartite from "./components/AltrePartite";
import ConfrontoFattura from "./components/ConfrontoFattura";
import AddOffertaModal from "./components/modals/AddOffertaModal";
import Fatture from "./components/Fatture";
import CambiaOffertaModal from "./components/modals/CambiaOffertaModal";
import DeleteOffertaModal from "./components/modals/DeleteOffertaModal";
import AddAltraPartitaModal from "./components/modals/AddAltraPartitaModal";
import DeleteAltraPartitaModal from "./components/modals/DeleteAltraPartitaModal";
import Utenti from "./components/Utenti";
import AddUtenteModal from "./components/modals/AddUtenteModal";
import DeleteUtenteModal from "./components/modals/DeleteUtenteModal";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
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
        <Route path="/offerte" element={<Offerte />} />
        <Route path="/altre-partite" element={<AltrePartite />} />
        <Route path="/fatture" element={<Fatture />} />
        <Route path="/fatture/:numero/confronto" element={<ConfrontoFattura />} />
        <Route path="/utenti" element={<Utenti />} />
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
      <AddOffertaModal />
      <CambiaOffertaModal />
      <DeleteOffertaModal />
      <AddAltraPartitaModal />
      <DeleteAltraPartitaModal />
      <AddUtenteModal />
      <DeleteUtenteModal />
    </BrowserRouter>
  );
}

export default App;
