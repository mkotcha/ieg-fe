import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Badge, Container, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { ConfrontoFattura as ConfrontoFatturaType, ConfrontoVoce } from "../types";
import { erroreApi } from "../utils/erroreApi";
import { formatEuro, formatNumero, NOMI_MESI } from "../utils/formato";
import RiepilogoConfronto from "./RiepilogoConfronto";

/**
 * Differenze tra una nostra fattura e le righe del fornitore, per fornitura e voce di confronto.
 * Le righe evidenziate sono anomale: voci passanti con importi diversi o kWh di energia/perdite diversi.
 */
const ConfrontoFattura = () => {
  const { numero } = useParams();
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const [confronto, setConfronto] = useState<ConfrontoFatturaType | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const [soloAnomale, setSoloAnomale] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const carica = async () => {
      try {
        const url = `${import.meta.env.VITE_REACT_APP_API_URL}/fatture/${numero}/confronto`;
        const response = await axios.get<ConfrontoFatturaType>(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConfronto(response.data);
      } catch (error) {
        setErrore(erroreApi(error, "Errore nel caricamento del confronto"));
      }
    };
    carica();
  }, [numero, token, navigate]);

  const classeDifferenza = (p: { data?: ConfrontoVoce }) => (p.data?.anomala ? "text-danger fw-semibold" : "");
  const [colDefs] = useState<ColDef<ConfrontoVoce>[]>([
    {
      field: "descrizione",
      headerName: "Voce",
      cellRenderer: (p: { value: string; data?: ConfrontoVoce }) => (
        <>
          {p.value}
          {p.data?.passante && (
            <Badge bg="secondary" className="ms-2" title="costo girato al cliente: nostro e fornitore devono coincidere">
              passante
            </Badge>
          )}
        </>
      ),
    },
    {
      field: "quantitaNostra",
      headerName: "Q.tà nostra",
      valueFormatter: p => formatNumero(p.value),
      type: "rightAligned",
    },
    {
      field: "quantitaFornitore",
      headerName: "Q.tà fornitore",
      valueFormatter: p => formatNumero(p.value),
      type: "rightAligned",
    },
    {
      field: "differenzaQuantita",
      headerName: "Diff. q.tà",
      valueFormatter: p => formatNumero(p.value),
      type: "rightAligned",
      cellClass: classeDifferenza,
    },
    { field: "importoNostro", headerName: "Nostro €", valueFormatter: p => formatEuro(p.value), type: "rightAligned" },
    {
      field: "importoFornitore",
      headerName: "Fornitore €",
      valueFormatter: p => formatEuro(p.value),
      type: "rightAligned",
    },
    {
      field: "differenzaImporto",
      headerName: "Diff. €",
      valueFormatter: p => formatEuro(p.value),
      type: "rightAligned",
      cellClass: classeDifferenza,
    },
  ]);

  const forniture = confronto?.forniture ?? [];
  const fornitureVisibili = soloAnomale ? forniture.filter(f => f.anomalie.length > 0) : forniture;

  return (
    <Container fluid className="content">
      {errore && (
        <Alert variant="danger" className="my-2 py-2">
          {errore}
        </Alert>
      )}
      {!confronto && !errore && <Spinner animation="border" size="sm" className="my-3" />}
      {confronto && (
        <>
          <h1>Confronto fattura {confronto.numeroFattura}</h1>
          <div className="mb-2">
            <Link to={`/cliente/${confronto.clienteId}`}>{confronto.ragioneSociale}</Link> · consumi di{" "}
            {NOMI_MESI[confronto.mese - 1]} {confronto.anno} · {forniture.length}{" "}
            {forniture.length === 1 ? "fornitura" : "forniture"}
          </div>
          <RiepilogoConfronto
            totaleNostro={confronto.totaleNostro}
            totaleFornitore={confronto.totaleFornitore}
            margine={confronto.margine}
            differenzaPassanti={confronto.differenzaPassanti}
            anomalie={confronto.anomalie}
            etichettaAnomalie="Anomalie"
          />
          {forniture.length > 1 && (
            <Form.Check
              type="switch"
              id="solo-anomale"
              className="my-2"
              label="solo forniture con anomalie"
              checked={soloAnomale}
              onChange={e => setSoloAnomale(e.target.checked)}
            />
          )}
          {fornitureVisibili.map(f => (
            <div key={f.pod} className="border rounded-3 bg-body-tertiary my-3">
              <div className="d-flex flex-wrap align-items-center gap-3 p-2">
                <Link to={`/fornitura/${f.pod}`} className="font-monospace fs-5">
                  {f.pod}
                </Link>
                <span>
                  BTA {f.bta ?? "-"}
                  {f.btaFornitore && f.btaFornitore !== f.bta && <> (fornitore {f.btaFornitore})</>}
                </span>
                <span>
                  potenza {formatNumero(f.potenzaImpegnata)} kW
                  {f.potenzaImpegnataFornitore !== null && f.potenzaImpegnataFornitore !== f.potenzaImpegnata && (
                    <> (fornitore {formatNumero(f.potenzaImpegnataFornitore)} kW)</>
                  )}
                </span>
                {f.bolletteFornitore.length > 0 && (
                  <span className="small text-body-secondary">bollette {f.bolletteFornitore.join(", ")}</span>
                )}
                {f.conguagli && (
                  <Badge bg="info" title="tra le righe del fornitore ci sono storni e rifatturazioni">
                    conguagli
                  </Badge>
                )}
                <span className="ms-auto">
                  nostro {formatEuro(f.totaleNostro)} € · fornitore {formatEuro(f.totaleFornitore)} € ·{" "}
                  <span className={f.margine < 0 ? "text-danger" : "text-success"}>margine {formatEuro(f.margine)} €</span>
                </span>
              </div>
              {f.anomalie.length > 0 ? (
                <Alert variant="warning" className="mx-2 py-2">
                  <ul className="mb-0">
                    {f.anomalie.map(a => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </Alert>
              ) : (
                <div className="mx-2 mb-2 text-success">Nessuna anomalia</div>
              )}
              <div className="ag-theme-quartz-dark">
                <AgGridReact
                  rowData={f.voci}
                  columnDefs={colDefs}
                  autoSizeStrategy={{ type: "fitCellContents" }}
                  domLayout="autoHeight"
                  enableCellTextSelection={true}
                  rowClassRules={{ "riga-anomala": p => !!p.data?.anomala }}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </Container>
  );
};

export default ConfrontoFattura;
