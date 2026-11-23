import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showAddUtenteModalAction } from "../redux/actions";
import { useAppDispatch, useAppSelector, useIsAdmin } from "../redux/hooks";
import type { Utente } from "../types";
import { erroreApi } from "../utils/erroreApi";
import UtenteUsername from "./cellComponents/UtenteUsername";

/** Gestione utenti (solo ADMIN): ADMIN può tutto, USER è in sola lettura. */
const Utenti = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(state => state.auth.token);
  const isAdmin = useIsAdmin();
  const showAddUtenteModal = useAppSelector(state => state.modal.showAddUtenteModal);
  const showDeleteUtenteModal = useAppSelector(state => state.modal.showDeleteUtenteModal);
  const [rowData, setRowData] = useState<Utente[]>([]);
  const [errore, setErrore] = useState<string | null>(null);
  const [colDefs] = useState<ColDef<Utente>[]>([
    { field: "username", headerName: "Username", filter: true, cellRenderer: UtenteUsername },
    {
      field: "ruolo",
      headerName: "Ruolo",
      filter: true,
      valueFormatter: p => (p.value === "ADMIN" ? "ADMIN (tutto)" : "USER (sola lettura)"),
    },
    { field: "nome", headerName: "Nome", filter: true },
    { field: "cognome", headerName: "Cognome", filter: true },
    { field: "email", headerName: "Email", filter: true },
    {
      field: "createdAt",
      headerName: "Creato il",
      valueFormatter: p => (p.value ? new Date(p.value).toLocaleDateString("it-IT") : ""),
    },
  ]);

  const autoSizeStrategy = {
    type: "fitCellContents",
  } as const;

  useEffect(() => {
    const fetchUtenti = async () => {
      try {
        const response = await axios.get<Utente[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/utenti`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRowData(response.data);
        setErrore(null);
      } catch (error) {
        setErrore(erroreApi(error, "Errore nel caricamento degli utenti"));
      }
    };
    if (token && isAdmin && !showAddUtenteModal && !showDeleteUtenteModal) fetchUtenti();
  }, [showAddUtenteModal, showDeleteUtenteModal, token, isAdmin]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Container fluid className="flex-grow-1">
      <div className="d-flex flex-column h-100">
        <div className="d-flex align-items-center">
          <h1>Utenti</h1>
          {isAdmin && (
            <div className="ms-auto ">
              <Button variant="primary" onClick={() => dispatch(showAddUtenteModalAction())}>
                Aggiungi utente
              </Button>
            </div>
          )}
        </div>
        {!isAdmin && <Alert variant="warning">La gestione utenti è riservata agli amministratori.</Alert>}
        {errore && <Alert variant="danger">{errore}</Alert>}
        {isAdmin && (
          <div className="ag-theme-quartz-dark flex-grow-1">
            <AgGridReact
              autoSizeStrategy={autoSizeStrategy}
              rowData={rowData}
              columnDefs={colDefs}
              enableCellTextSelection={true}
              ensureDomOrder={true}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default Utenti;
