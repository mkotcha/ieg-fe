import { AgGridReact } from "ag-grid-react";
import type { CellValueChangedEvent, ColDef } from "ag-grid-community";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showAddAltraPartitaModalAction } from "../redux/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import AltraPartitaPod from "./cellComponents/AltraPartitaPod";
import type { AltraPartita } from "../types";

const AltrePartite = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const showAddAltraPartitaModal = useAppSelector(state => state.modal.showAddAltraPartitaModal);
  const showDeleteAltraPartitaModal = useAppSelector(state => state.modal.showDeleteAltraPartitaModal);
  const [rowData, setRowData] = useState<AltraPartita[]>([]);
  // cambia per ricaricare le partite (es. dopo un errore nell'attivazione)
  const [aggiornamento, setAggiornamento] = useState(0);
  const [colDefs] = useState<ColDef<AltraPartita>[]>([
    {
      field: "attiva",
      headerName: "Attiva",
      headerTooltip: "le partite non attive restano in archivio ma non vanno in fattura",
      // casella cliccabile: il cambio viene salvato subito (onCellValueChanged)
      cellDataType: "boolean",
      editable: true,
      filter: true,
    },
    { field: "fornitura.id", headerName: "POD", filter: true, cellRenderer: AltraPartitaPod },
    { field: "fornitura.cliente.ragioneSociale", headerName: "Cliente", filter: true },
    { field: "mese", headerName: "Mese", type: "numericColumn", filter: true },
    { field: "anno", headerName: "Anno", type: "numericColumn", filter: true },
    { field: "voce", headerName: "Voce", filter: true },
    {
      field: "importo",
      headerName: "Importo",
      type: "numericColumn",
      valueFormatter: p =>
        p.value == null ? "" : p.value.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    {
      field: "esenteIva",
      headerName: "IVA",
      // esente: fuori dall'imponibile, solo nel totale da pagare; soggetta: paga l'iva della fornitura
      valueFormatter: p => (p.value ? "esente" : "soggetta"),
      filter: true,
    },
  ]);

  const cambiaAttiva = async (event: CellValueChangedEvent<AltraPartita>) => {
    if (event.colDef.field !== "attiva" || !event.data) return;
    try {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/altre-partite/${event.data.id}/attiva?attiva=${event.newValue}`;
      await axios.put(url, null, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error(error);
      // ricarica per rimettere il valore salvato
      setAggiornamento(n => n + 1);
    }
  };

  const autoSizeStrategy = {
    type: "fitCellContents",
  } as const;

  useEffect(() => {
    const fetchAltrePartite = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/altre-partite`;
      const response = await axios.get<AltraPartita[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // dalla più recente: anno e mese di fatturazione, poi l'ultima inserita
      setRowData([...response.data].sort((a, b) => b.anno - a.anno || b.mese - a.mese || b.id - a.id));
    };
    if (!showAddAltraPartitaModal && !showDeleteAltraPartitaModal) fetchAltrePartite();
  }, [showAddAltraPartitaModal, showDeleteAltraPartitaModal, token, aggiornamento]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Container fluid className="flex-grow-1">
      <div className="d-flex flex-column h-100">
        <div className="d-flex align-items-center">
          <h1>Altre partite</h1>
          <div className="ms-auto ">
            <Button variant="primary" onClick={() => dispatch(showAddAltraPartitaModalAction())}>
              Aggiungi partita
            </Button>
          </div>
        </div>
        <div className="ag-theme-quartz-dark flex-grow-1">
          <AgGridReact
            autoSizeStrategy={autoSizeStrategy}
            suppressColumnVirtualisation={true}
            rowData={rowData}
            columnDefs={colDefs}
            onCellValueChanged={cambiaAttiva}
            rowClassRules={{ "opacity-50": p => p.data?.attiva === false }}
            enableCellTextSelection={true}
            ensureDomOrder={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default AltrePartite;
