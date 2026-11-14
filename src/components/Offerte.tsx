import { AgGridReact } from "ag-grid-react";
import type { ColDef, RowClickedEvent, ValueFormatterParams } from "ag-grid-community";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { showAddOffertaModalAction } from "../redux/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import OffertaNome from "./cellComponents/OffertaNome";
import type { Fornitura, Offerta, PagedResponse } from "../types";

const formatNumero = (params: ValueFormatterParams<Offerta, number | null>) =>
  params.value == null ? "" : params.value.toLocaleString("it-IT", { maximumFractionDigits: 6 });
const formatBool = (params: ValueFormatterParams<Offerta, boolean>) => (params.value ? "Sì" : "No");

const Offerte = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const showAddOffertaModal = useAppSelector(state => state.modal.showAddOffertaModal);
  const showDeleteOffertaModal = useAppSelector(state => state.modal.showDeleteOffertaModal);
  const [rowData, setRowData] = useState<Offerta[]>([]);
  const [colDefs] = useState<ColDef<Offerta>[]>([
    { field: "nome", headerName: "Nome", filter: true, cellRenderer: OffertaNome },
    { field: "codice", headerName: "Codice", filter: true },
    { field: "tipo", headerName: "Tipo", filter: true },
    { field: "f1", headerName: "F1", type: "numericColumn", valueFormatter: formatNumero },
    { field: "f2", headerName: "F2", type: "numericColumn", valueFormatter: formatNumero },
    { field: "f3", headerName: "F3", type: "numericColumn", valueFormatter: formatNumero },
    { field: "pun", headerName: "PUN", valueFormatter: formatBool },
    { field: "capacitaMaggiorazione", headerName: "Maggiorazione capacità", valueFormatter: formatBool },
    { field: "maggiorazione", headerName: "Maggiorazione", type: "numericColumn", valueFormatter: formatNumero },
    { field: "hasSpread", headerName: "Spread attivo", valueFormatter: formatBool },
    { field: "spread", headerName: "Spread", type: "numericColumn", valueFormatter: formatNumero },
    { field: "ocv", headerName: "OCV", type: "numericColumn", valueFormatter: formatNumero },
    { field: "modalitaProgrammazione", headerName: "Modalità OCV" },
    { field: "ocf", headerName: "OCF", type: "numericColumn", valueFormatter: formatNumero },
    { field: "dataInizio", headerName: "Data inizio", filter: true },
    { field: "dataFine", headerName: "Data fine", filter: true },
    { field: "descrizione", headerName: "Descrizione" },
  ]);

  const [offertaSelezionata, setOffertaSelezionata] = useState<Offerta | null>(null);
  const [forniture, setForniture] = useState<Fornitura[]>([]);
  const [fornitureColDefs] = useState<ColDef<Fornitura>[]>([
    {
      field: "id",
      headerName: "POD",
      filter: true,
      cellRenderer: (p: { value: string }) => (
        <Link to={`/fornitura/${p.value}`} className="text-decoration-none text-reset">
          {p.value}
        </Link>
      ),
    },
    {
      field: "cliente.ragioneSociale",
      headerName: "Cliente",
      filter: true,
      cellRenderer: (p: { value: string; data?: Fornitura }) => (
        <Link to={`/cliente/${p.data?.cliente?.id}`} className="text-decoration-none text-reset">{p.value}</Link>
      ),
    },
    { field: "indirizzo", headerName: "Indirizzo" },
    { field: "comune", headerName: "Comune", filter: true },
    { field: "provincia", headerName: "Provincia" },
    { field: "tipoContatore", headerName: "Contatore" },
    { field: "potenzaImpegnata", headerName: "Potenza impegnata", type: "numericColumn" },
    { field: "dataSwitch", headerName: "Data switch", filter: true },
    { field: "dataSwitchOut", headerName: "Data switch out", filter: true },
  ]);

  const onRowClicked = (e: RowClickedEvent<Offerta>) => {
    // i pulsanti modifica/elimina della cella non selezionano l'offerta
    if ((e.event?.target as HTMLElement | null)?.closest("button")) return;
    setOffertaSelezionata(e.data ?? null);
  };

  const autoSizeStrategy = {
    type: "fitCellContents",
  } as const;

  useEffect(() => {
    const fetchOfferte = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/offerte`;
      const response = await axios.get<Offerta[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRowData(response.data);
    };
    if (!showAddOffertaModal && !showDeleteOffertaModal) fetchOfferte();
  }, [showAddOffertaModal, showDeleteOffertaModal, token]);

  // forniture con l'offerta selezionata: il backend non filtra per offerta, si filtra qui
  useEffect(() => {
    const fetchForniture = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture?size=10000`;
      const response = await axios.get<PagedResponse<Fornitura>>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForniture(response.data.content.filter(f => f.offerta?.id === offertaSelezionata?.id));
    };
    if (offertaSelezionata) fetchForniture();
    else setForniture([]);
  }, [offertaSelezionata, token]);

  // se l'offerta selezionata viene eliminata si chiude il dettaglio
  useEffect(() => {
    setOffertaSelezionata(prev => (prev && rowData.some(o => o.id === prev.id) ? prev : null));
  }, [rowData]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Container fluid className="flex-grow-1">
      <div className="d-flex flex-column h-100">
        <div className="d-flex align-items-center">
          <h1>Offerte</h1>
          <div className="ms-auto ">
            <Button variant="primary" onClick={() => dispatch(showAddOffertaModalAction())}>
              Aggiungi offerta
            </Button>
          </div>
        </div>
        <div className="ag-theme-quartz-dark flex-grow-1">
          <AgGridReact
            autoSizeStrategy={autoSizeStrategy}
            suppressColumnVirtualisation={true}
            rowData={rowData}
            columnDefs={colDefs}
            enableCellTextSelection={true}
            ensureDomOrder={true}
            rowSelection="single"
            onRowClicked={onRowClicked}
          />
        </div>
        {offertaSelezionata && (
          <>
            <div className="d-flex align-items-center mt-1">
              <h2 className="my-2">
                Forniture con offerta {offertaSelezionata.nome} ({forniture.length})
              </h2>
              <Button variant="secondary" size="sm" className="ms-auto" onClick={() => setOffertaSelezionata(null)}>
                Chiudi
              </Button>
            </div>
            <div className="ag-theme-quartz-dark flex-grow-1">
              <AgGridReact
                autoSizeStrategy={autoSizeStrategy}
                rowData={forniture}
                columnDefs={fornitureColDefs}
                enableCellTextSelection={true}
                overlayNoRowsTemplate="Nessuna fornitura con questa offerta"
              />
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default Offerte;
