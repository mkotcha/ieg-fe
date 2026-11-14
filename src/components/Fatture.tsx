import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { FatturaElenco } from "../types";
import { erroreApi } from "../utils/erroreApi";
import { formatEuro, formatNumero, NOMI_MESI } from "../utils/formato";
import PulsantiFattura from "./cellComponents/PulsantiFattura";

const formatData = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString("it-IT") : "");

/**
 * Tutte le fatture emesse, dalla più recente alla più vecchia (mese di consumo). Il numero apre il confronto con il
 * fornitore della fattura, il cliente la sua pagina; i pulsanti scaricano excel e pdf.
 */
const Fatture = () => {
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const [fatture, setFatture] = useState<FatturaElenco[]>([]);
  const [errore, setErrore] = useState<string | null>(null);
  const [ricerca, setRicerca] = useState("");

  const [colDefs] = useState<ColDef<FatturaElenco>[]>([
    {
      field: "numeroFattura",
      headerName: "Numero fattura",
      filter: true,
      cellRenderer: (p: ICellRendererParams<FatturaElenco, string>) =>
        p.value ? (
          <div className="d-flex">
            <Link
              to={`/fatture/${p.value}/confronto`}
              className="text-decoration-none text-reset"
              title="confronto con il fornitore">
              {p.value}
            </Link>
            <PulsantiFattura numero={p.value} confronto={false} />
          </div>
        ) : null,
    },
    {
      field: "mese",
      headerName: "Mese",
      filter: true,
      valueFormatter: p => (p.value ? NOMI_MESI[p.value - 1] : ""),
      // il filtro di testo cerca nel nome del mese
      filterValueGetter: p => (p.data ? NOMI_MESI[p.data.mese - 1] : ""),
    },
    { field: "anno", headerName: "Anno", filter: true },
    { field: "dataFattura", headerName: "Data emissione", valueFormatter: p => formatData(p.value) },
    {
      field: "ragioneSociale",
      headerName: "Cliente",
      filter: true,
      cellRenderer: (p: ICellRendererParams<FatturaElenco, string>) => (
        <Link to={`/cliente/${p.data?.clienteId}`} className="text-decoration-none text-reset">
          {p.value}
        </Link>
      ),
    },
    { field: "forniture", headerName: "POD", type: "rightAligned" },
    {
      field: "consumoTot",
      headerName: "Consumo kWh",
      type: "rightAligned",
      valueFormatter: p => formatNumero(p.value, 0),
    },
    {
      field: "totaleImponibile",
      headerName: "Imponibile €",
      type: "rightAligned",
      valueFormatter: p => formatEuro(p.value),
    },
    { field: "totaleIva", headerName: "IVA €", type: "rightAligned", valueFormatter: p => formatEuro(p.value) },
    {
      field: "totaleDaPagare",
      headerName: "Da pagare €",
      type: "rightAligned",
      valueFormatter: p => formatEuro(p.value),
    },
  ]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get<FatturaElenco[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/fatture/elenco`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(r => setFatture(r.data))
      .catch(error => setErrore(erroreApi(error, "Errore nel caricamento delle fatture")));
  }, [token, navigate]);

  return (
    <Container fluid className="flex-grow-1">
      <div className="d-flex flex-column h-100">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <h1 className="me-auto">Fatture</h1>
          <span className="text-body-secondary">{fatture.length} fatture</span>
          <Form.Control
            size="sm"
            type="search"
            placeholder="cerca numero, cliente, mese..."
            style={{ width: 260 }}
            value={ricerca}
            onChange={e => setRicerca(e.target.value)}
          />
        </div>
        {errore && (
          <Alert variant="danger" className="py-2">
            {errore}
          </Alert>
        )}
        <div className="ag-theme-quartz-dark flex-grow-1">
          <AgGridReact
            rowData={fatture}
            columnDefs={colDefs}
            autoSizeStrategy={{ type: "fitCellContents" }}
            enableCellTextSelection={true}
            quickFilterText={ricerca}
          />
        </div>
      </div>
    </Container>
  );
};

export default Fatture;
