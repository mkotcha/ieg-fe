import { AgGridReact } from "ag-grid-react";
import type { CellValueChangedEvent, ColDef, GetRowIdParams, ValueSetterParams } from "ag-grid-community";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { showAddDispacciamentoModalAction, showAddOneriModalAction } from "../redux/actions";
import { useEffect } from "react";
import axios from "axios";
import OneriTipo from "./cellComponents/OneriTipo";
import DispacciamentoMod from "./cellComponents/DispacciamentoMod";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { Dispacciamento, Oneri as OneriType } from "../types";

// valori modificabili in stile excel (doppio clic, F2 o digitando): il cambio viene salvato subito (salvaCella)
const modificabile = { editable: true, cellEditor: "agNumberCellEditor" } as const;

// periodo (mese, trimestre, anno) modificabile: solo interi nell'intervallo, altrimenti la cella torna al valore precedente
const intero = (min: number, max: number) => ({
  ...modificabile,
  cellEditorParams: { min, max, precision: 0 },
  valueSetter: (p: ValueSetterParams) => {
    const campo = p.colDef.field;
    const valore = p.newValue;
    if (!campo || !Number.isInteger(valore) || valore < min || valore > max) return false;
    (p.data as Record<string, unknown>)[campo] = valore;
    return true;
  },
});

// con l'id le righe restano al loro posto quando i dati vengono ricaricati
const rigaId = <T extends { id: number }>(p: GetRowIdParams<T>) => String(p.data.id);

const Oneri = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const showAddOneriModal = useAppSelector(state => state.modal.showAddOneriModal);
  const showDeleteOneriModal = useAppSelector(state => state.modal.showDeleteOneriModal);
  const showAddDispacciamentoModal = useAppSelector(state => state.modal.showAddDispacciamentoModal);
  const showDeleteDispacciamentoModal = useAppSelector(state => state.modal.showDeleteDispacciamentoModal);
  // cambiano per ricaricare le griglie (es. dopo un errore nel salvataggio di una cella)
  const [aggiornamentoOneri, setAggiornamentoOneri] = useState(0);
  const [aggiornamentoDispacciamento, setAggiornamentoDispacciamento] = useState(0);
  const [oneriRowData, setOneriRowData] = useState<OneriType[]>([]);
  const [oneriColDefs] = useState<ColDef<OneriType>[]>([
    { field: "tipo", headerName: "Tipo", filter: true, cellRenderer: OneriTipo },
    { field: "trimestre", headerName: "Trimestre", type: "numericColumn", filter: true, ...intero(1, 4) },
    { field: "anno", headerName: "Anno", type: "numericColumn", filter: true, ...intero(2000, 2100) },
    { field: "qeTud", headerName: "qeTud", type: "numericColumn", ...modificabile },
    { field: "qpTdm", headerName: "qpTdm", type: "numericColumn", ...modificabile },
    { field: "qfTud", headerName: "qfTud", type: "numericColumn", ...modificabile },
    { field: "qfMis", headerName: "qfMis", type: "numericColumn", ...modificabile },
    { field: "qeArim", headerName: "qeArim", type: "numericColumn", ...modificabile },
    { field: "qeAsos", headerName: "qeAsos", type: "numericColumn", ...modificabile },
    { field: "qeUc3", headerName: "qeUc3", type: "numericColumn", ...modificabile },
    { field: "qpArim", headerName: "qpArim", type: "numericColumn", ...modificabile },
    { field: "qpAsos", headerName: "qpAsos", type: "numericColumn", ...modificabile },
    { field: "qpOds", headerName: "qpOds", type: "numericColumn", ...modificabile },
    { field: "qfArim", headerName: "qfArim", type: "numericColumn", ...modificabile },
    { field: "qfAsos", headerName: "qfAsos", type: "numericColumn", ...modificabile },
  ]);
  const [dispacciamentoRowData, setDispacciamentoRowData] = useState<Dispacciamento[]>([]);
  const [dispacciamentoColDefs] = useState<ColDef<Dispacciamento>[]>([
    { cellRenderer: DispacciamentoMod },
    { field: "mese", headerName: "Mese", type: "numericColumn", filter: true, ...intero(1, 12) },
    { field: "anno", headerName: "Anno", type: "numericColumn", filter: true, ...intero(2000, 2100) },
    { field: "capacita", headerName: "Capacità", type: "numericColumn", ...modificabile },
    { field: "costoAm", headerName: "CostoAm", type: "numericColumn", ...modificabile },
    { field: "dis", headerName: "DIS", type: "numericColumn", ...modificabile },
    { field: "sbilanciamento", headerName: "Sbilanciamento", type: "numericColumn", ...modificabile },
  ]);

  const autoSizeStrategy = {
    type: "fitCellContents",
  } as const;

  // salva l'intera riga con lo stesso PUT della modale; se fallisce ricarica per rimettere il valore salvato
  const salvaCella =
    <T extends { id: number }>(percorso: string, ricarica: () => void) =>
    async (event: CellValueChangedEvent<T>) => {
      if (!event.data || event.oldValue === event.newValue) return;
      // cella svuotata: non si salva, torna il valore precedente
      if (event.newValue == null) {
        ricarica();
        return;
      }
      try {
        const url = `${import.meta.env.VITE_REACT_APP_API_URL}/${percorso}/${event.data.id}`;
        await axios.put(url, event.data, { headers: { Authorization: `Bearer ${token}` } });
      } catch (error) {
        console.error(error);
        ricarica();
      }
    };

  useEffect(() => {
    const fetchOneri = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/oneri`;
      const response = await axios.get<OneriType[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // dal trimestre più recente; nello stesso trimestre per tipo (BTA)
      setOneriRowData(
        [...response.data].sort((a, b) => b.anno - a.anno || b.trimestre - a.trimestre || a.tipo.localeCompare(b.tipo)),
      );
    };

    if (!showAddOneriModal && !showDeleteOneriModal) fetchOneri();
  }, [showAddOneriModal, showDeleteOneriModal, token, aggiornamentoOneri]);

  useEffect(() => {
    const fetchDispacciamento = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/dispacciamento`;
      const response = await axios.get<Dispacciamento[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // dal mese più recente
      setDispacciamentoRowData([...response.data].sort((a, b) => b.anno - a.anno || b.mese - a.mese));
    };
    if (!showAddDispacciamentoModal && !showDeleteDispacciamentoModal) fetchDispacciamento();
  }, [showDeleteDispacciamentoModal, showAddDispacciamentoModal, token, aggiornamentoDispacciamento]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Container fluid className="flex-grow-1">
      <div className="d-flex flex-column h-100">
        <div className="d-flex align-items-center">
          <h1>Oneri</h1>
          <div className="ms-auto ">
            <Button variant="primary" onClick={() => dispatch(showAddOneriModalAction())}>
              Aggiungi oneri
            </Button>
          </div>
        </div>
        <div className="ag-theme-quartz-dark flex-grow-1">
          {/* The AG Grid component */}
          <AgGridReact
            autoSizeStrategy={autoSizeStrategy}
            suppressColumnVirtualisation={true}
            rowData={oneriRowData}
            columnDefs={oneriColDefs}
            getRowId={rigaId}
            onCellValueChanged={salvaCella<OneriType>("oneri", () => setAggiornamentoOneri(n => n + 1))}
            stopEditingWhenCellsLoseFocus={true}
            enterNavigatesVerticallyAfterEdit={true}
            undoRedoCellEditing={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
          />
        </div>

        <div className="d-flex align-items-center mt-1">
          <h1>Dispacciamento</h1>
          <div className="ms-auto ">
            <Button variant="primary" onClick={() => dispatch(showAddDispacciamentoModalAction())} className="me-2">
              Aggiungi dispacciamento
            </Button>
          </div>
        </div>
        <div className="ag-theme-quartz-dark flex-grow-1">
          {/* The AG Grid component */}
          <AgGridReact
            autoSizeStrategy={autoSizeStrategy}
            suppressColumnVirtualisation={true}
            rowData={dispacciamentoRowData}
            columnDefs={dispacciamentoColDefs}
            getRowId={rigaId}
            onCellValueChanged={salvaCella<Dispacciamento>("dispacciamento", () =>
              setAggiornamentoDispacciamento(n => n + 1),
            )}
            stopEditingWhenCellsLoseFocus={true}
            enterNavigatesVerticallyAfterEdit={true}
            undoRedoCellEditing={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default Oneri;
