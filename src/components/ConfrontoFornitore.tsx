import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type {
  ConfrontoFattura,
  ConfrontoMese,
  EsitoImportFatturaFornitore,
  FatturaFornitore,
  TariffaNonMappata,
} from "../types";
import { erroreApi } from "../utils/erroreApi";
import { formatEuro, NOMI_MESI } from "../utils/formato";
import RiepilogoConfronto from "./RiepilogoConfronto";

interface Props {
  mese: number;
  anno: number;
}

/**
 * Sezione della home: import dei csv del fornitore e confronto di tutte le fatture emesse nel mese con le sue righe.
 * Cliccando una fattura si apre il dettaglio per fornitura e voce.
 */
const ConfrontoFornitore = ({ mese, anno }: Props) => {
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const [confronto, setConfronto] = useState<ConfrontoMese | null>(null);
  const [bollette, setBollette] = useState<FatturaFornitore[]>([]);
  const [nonMappate, setNonMappate] = useState<TariffaNonMappata[]>([]);
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [upload, setUpload] = useState(false);
  const [esitiUpload, setEsitiUpload] = useState<EsitoImportFatturaFornitore[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const api = import.meta.env.VITE_REACT_APP_API_URL;

  const carica = useCallback(async () => {
    setCaricamento(true);
    setErrore(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [c, b, n] = await Promise.all([
        axios.get<ConfrontoMese>(`${api}/fatture/confronto?mese=${mese}&anno=${anno}`, { headers }),
        axios.get<FatturaFornitore[]>(`${api}/fatture-fornitore`, { headers }),
        axios.get<TariffaNonMappata[]>(`${api}/fatture-fornitore/mappature/non-mappate`, { headers }),
      ]);
      setConfronto(c.data);
      setBollette(b.data);
      setNonMappate(n.data);
    } catch (error) {
      setErrore(erroreApi(error, "Errore nel caricamento del confronto con il fornitore"));
    } finally {
      setCaricamento(false);
    }
  }, [api, anno, mese, token]);

  useEffect(() => {
    if (token) carica();
  }, [carica, token]);

  const caricaFile = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUpload(true);
    setErrore(null);
    setEsitiUpload(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post<EsitoImportFatturaFornitore[]>(`${api}/fatture-fornitore/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEsitiUpload(response.data);
      if (fileRef.current) fileRef.current.value = "";
      carica();
    } catch (error) {
      setErrore(erroreApi(error, "Errore durante l'import della fattura del fornitore"));
    } finally {
      setUpload(false);
    }
  };

  const [colDefs] = useState<ColDef<ConfrontoFattura>[]>([
    {
      field: "numeroFattura",
      headerName: "Fattura",
      filter: true,
      cellRenderer: (p: { value: string }) => <Link to={`/fatture/${p.value}/confronto`}>{p.value}</Link>,
    },
    {
      field: "ragioneSociale",
      headerName: "Cliente",
      filter: true,
      cellRenderer: (p: { value: string; data?: ConfrontoFattura }) => (
        <Link to={`/cliente/${p.data?.clienteId}`} onClick={e => e.stopPropagation()}>
          {p.value}
        </Link>
      ),
    },
    { field: "totaleNostro", headerName: "Nostro €", valueFormatter: p => formatEuro(p.value), type: "rightAligned" },
    { field: "totaleFornitore", headerName: "Fornitore €", valueFormatter: p => formatEuro(p.value), type: "rightAligned" },
    {
      field: "margine",
      headerName: "Margine €",
      valueFormatter: p => formatEuro(p.value),
      type: "rightAligned",
      cellClass: p => ((p.value ?? 0) < 0 ? "text-danger" : "text-success"),
    },
    {
      field: "differenzaPassanti",
      headerName: "Diff. passanti €",
      valueFormatter: p => formatEuro(p.value),
      type: "rightAligned",
      cellClass: p => (Math.abs(p.value ?? 0) > 1 ? "text-warning" : ""),
    },
    {
      field: "anomalie",
      headerName: "Anomalie",
      type: "rightAligned",
      sort: "desc",
      cellClass: p => ((p.value ?? 0) > 0 ? "text-warning fw-semibold" : "text-success"),
    },
  ]);

  const fattureConAnomalie = confronto?.fatture.filter(f => f.anomalie > 0).length ?? 0;
  const nomeMese = NOMI_MESI[mese - 1];

  return (
    <div className="border rounded-3 my-3">
      <div className="bg-body-tertiary p-2 d-flex flex-wrap align-items-center gap-2">
        <h3 className="m-0 me-auto">
          Confronto con il fornitore - {nomeMese} {anno}
        </h3>
        <Form.Control ref={fileRef} type="file" accept=".csv,.zip" size="sm" style={{ width: "auto" }} />
        <Button size="sm" variant="primary" onClick={caricaFile} disabled={upload}>
          {upload ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" /> import in corso...
            </>
          ) : (
            "importa fattura fornitore"
          )}
        </Button>
      </div>
      <div className="p-2">
        {errore && (
          <Alert variant="danger" className="py-2">
            {errore}
          </Alert>
        )}
        {esitiUpload?.map(e => (
          <Alert key={e.numero} variant="success" className="py-2" dismissible onClose={() => setEsitiUpload(null)}>
            Bolletta <strong>{e.numero}</strong> {e.sostituita ? "sostituita" : "importata"}: {e.righe.toLocaleString("it-IT")}{" "}
            righe, imponibile {formatEuro(e.totaleImponibile)} €
            {e.righeScartate > 0 && <> · {e.righeScartate} righe scartate (vedi log)</>}
            {e.righeNonMappate > 0 && <> · {e.righeNonMappate} righe non mappate</>}
            {e.podSconosciuti.length > 0 && <> · POD non in anagrafica: {e.podSconosciuti.join(", ")}</>}
          </Alert>
        ))}
        {nonMappate.length > 0 && (
          <Alert variant="warning" className="py-2">
            Tariffe del fornitore senza mappatura (finiscono in &quot;Non mappata&quot;):{" "}
            {nonMappate.map(t => `${t.codTariffa ?? t.nrArticolo} - ${t.descrizione}`).join("; ")}
          </Alert>
        )}

        {caricamento && !confronto && <Spinner animation="border" size="sm" />}
        {confronto && (
          <>
            {!confronto.datiFornitore && (
              <Alert variant="info" className="py-2">
                Nessuna riga del fornitore per {nomeMese} {anno}: importa la bolletta del mese successivo.
              </Alert>
            )}
            {confronto.fatture.length === 0 ? (
              <div>Nessuna fattura emessa per il periodo.</div>
            ) : (
              <>
                <RiepilogoConfronto
                  totaleNostro={confronto.totaleNostro}
                  totaleFornitore={confronto.totaleFornitore}
                  margine={confronto.margine}
                  differenzaPassanti={confronto.differenzaPassanti}
                  anomalie={fattureConAnomalie}
                  etichettaAnomalie={`Fatture con anomalie su ${confronto.fatture.length}`}
                  costiIeg={confronto.costiIeg}
                />
                <div className="ag-theme-quartz-dark mt-2" style={{ height: 420 }}>
                  <AgGridReact
                    rowData={confronto.fatture}
                    columnDefs={colDefs}
                    autoSizeStrategy={{ type: "fitCellContents" }}
                    enableCellTextSelection={true}
                    onRowDoubleClicked={e => e.data && navigate(`/fatture/${e.data.numeroFattura}/confronto`)}
                  />
                </div>
              </>
            )}
            {confronto.podSenzaFattura.length > 0 && (
              <div className="mt-3">
                <div>POD fatturati dal fornitore senza una nostra fattura nel mese:</div>
                <Table size="sm" striped bordered className="mt-1 w-auto">
                  <thead>
                    <tr>
                      <th>POD</th>
                      <th>In anagrafica</th>
                      <th className="text-end">Importo fornitore €</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confronto.podSenzaFattura.map(p => (
                      <tr key={p.pod}>
                        <td className="font-monospace">
                          {p.inAnagrafica ? <Link to={`/fornitura/${p.pod}`}>{p.pod}</Link> : p.pod}
                        </td>
                        <td>{p.inAnagrafica ? "sì" : "no"}</td>
                        <td className="text-end">{formatEuro(p.importoFornitore)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        )}
        {bollette.length > 0 && (
          <div className="small text-body-secondary mt-2">
            Bollette del fornitore importate:{" "}
            {bollette
              .map(b => `${b.numero} del ${b.dataEmissione ? new Date(b.dataEmissione).toLocaleDateString("it-IT") : "?"}`)
              .join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfrontoFornitore;
