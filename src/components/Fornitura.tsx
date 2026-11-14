import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import axios from "axios";
import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  showAddFornituraModalAction,
  showAddOffertaModalAction,
  showNuovaOffertaFornituraModalAction,
} from "../redux/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { Fattura, FatturaSingola, Fornitura as FornituraType, Offerta } from "../types";
import { erroreApi } from "../utils/erroreApi";
import { formatEuro, formatNumero, NOMI_MESI } from "../utils/formato";
import FatturaNumero from "./cellComponents/FatturaNumero";

/** Riga della tabella fatture: la fattura del cliente con la parte di questa fornitura. */
type FatturaFornitura = Fattura & { singola: FatturaSingola };

const ULTIME_FATTURE = 12;

const formatData = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString("it-IT") : "");
const siNo = (b: boolean | null | undefined) => (b ? "Sì" : "No");

/** Riquadro con un titolo e un elenco di coppie etichetta / valore. */
const Scheda = ({
  titolo,
  azioni,
  righe,
  children,
}: {
  titolo: ReactNode;
  azioni?: ReactNode;
  righe: [string, ReactNode][];
  children?: ReactNode;
}) => (
  <div className="border rounded-3 bg-body-tertiary h-100">
    <div className="d-flex align-items-center border-bottom">
      <h4 className="m-2 me-auto">{titolo}</h4>
      {azioni}
    </div>
    <table className="table table-sm table-borderless m-0 small">
      <tbody>
        {righe.map(([etichetta, valore]) => (
          <tr key={etichetta}>
            <th className="text-body-secondary fw-normal ps-2 text-nowrap bg-transparent">{etichetta}</th>
            <td className="bg-transparent">{valore ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {children}
  </div>
);

const Fornitura = () => {
  const { id } = useParams();
  const [fornitura, setFornitura] = useState<FornituraType | null>(null);
  const [fatture, setFatture] = useState<FatturaFornitura[]>([]);
  const token = useAppSelector(state => state.auth.token);
  const showAddFornituraModal = useAppSelector(state => state.modal.showAddFornituraModal);
  const showAddOffertaModal = useAppSelector(state => state.modal.showAddOffertaModal);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // cambio offerta: elenco delle offerte caricato solo quando serve
  const [cambioOfferta, setCambioOfferta] = useState(false);
  const [offerte, setOfferte] = useState<Offerta[]>([]);
  const [offertaScelta, setOffertaScelta] = useState("");
  const [erroreOfferta, setErroreOfferta] = useState<string | null>(null);

  const apriCambioOfferta = async () => {
    setErroreOfferta(null);
    setOffertaScelta(fornitura?.offerta ? String(fornitura.offerta.id) : "");
    setCambioOfferta(true);
    try {
      const response = await axios.get<Offerta[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/offerte`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOfferte([...response.data].sort((a, b) => a.nome.localeCompare(b.nome)));
    } catch (error) {
      setErroreOfferta(erroreApi(error, "Errore nel caricamento delle offerte"));
    }
  };

  const confermaCambioOfferta = async () => {
    if (!offertaScelta) return;
    setErroreOfferta(null);
    try {
      const response = await axios.put<FornituraType>(
        `${import.meta.env.VITE_REACT_APP_API_URL}/forniture/${id}/offerta?offertaId=${offertaScelta}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFornitura(response.data);
      setCambioOfferta(false);
    } catch (error) {
      setErroreOfferta(erroreApi(error, "Errore nel cambio dell'offerta"));
    }
  };

  // ricaricata anche alla chiusura delle modali di modifica fornitura/offerta
  useEffect(() => {
    if (!token || showAddFornituraModal || showAddOffertaModal) return;
    const api = import.meta.env.VITE_REACT_APP_API_URL;
    const headers = { Authorization: `Bearer ${token}` };
    const carica = async () => {
      const response = await axios.get<FornituraType>(`${api}/forniture/${id}`, { headers });
      setFornitura(response.data);
      // fatture del cliente, tenendo per ognuna solo la parte di questa fornitura
      const risposta = await axios.get<Fattura[]>(`${api}/clienti/${response.data.cliente.id}/fatture`, { headers });
      const righe = risposta.data
        .flatMap(f => {
          const singola = f.fattureSingole?.find(fs => fs.fornitura?.id === id);
          return singola ? [{ ...f, singola }] : [];
        })
        .sort((a, b) => b.anno - a.anno || b.mese - a.mese || b.numeroFattura.localeCompare(a.numeroFattura))
        .slice(0, ULTIME_FATTURE);
      setFatture(righe);
    };
    carica();
  }, [id, token, showAddFornituraModal, showAddOffertaModal]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const [colDefs] = useState<ColDef<FatturaFornitura>[]>([
    { field: "numeroFattura", headerName: "Numero fattura", cellRenderer: FatturaNumero },
    { field: "mese", headerName: "Mese", valueFormatter: p => (p.value ? NOMI_MESI[p.value - 1] : "") },
    { field: "anno", headerName: "Anno" },
    { field: "dataFattura", headerName: "Data emissione", valueFormatter: p => formatData(p.value) },
    {
      colId: "periodo",
      headerName: "Letture",
      valueGetter: p =>
        `${formatData(p.data?.singola.letturaIniziale?.dataLettura)} - ${formatData(p.data?.singola.letturaFinale?.dataLettura)}`,
    },
    {
      field: "singola.consumoTot",
      headerName: "Consumo kWh",
      type: "rightAligned",
      valueFormatter: p => formatNumero(p.value, 0),
    },
    {
      field: "singola.potenzaPrelevata",
      headerName: "Picco kW",
      type: "rightAligned",
      valueFormatter: p => formatNumero(p.value, 1),
    },
    {
      field: "singola.spesaMedia",
      headerName: "Prezzo medio €/kWh",
      type: "rightAligned",
      valueFormatter: p => formatNumero(p.value, 4),
    },
    { field: "singola.totaleMateria", headerName: "Materia €", type: "rightAligned", valueFormatter: p => formatEuro(p.value) },
    { field: "singola.totaleTrasporto", headerName: "Trasporto €", type: "rightAligned", valueFormatter: p => formatEuro(p.value) },
    { field: "singola.totaleOneri", headerName: "Oneri €", type: "rightAligned", valueFormatter: p => formatEuro(p.value) },
    { field: "singola.totaleImposte", headerName: "Imposte €", type: "rightAligned", valueFormatter: p => formatEuro(p.value) },
    { field: "singola.totaleImponibile", headerName: "Imponibile €", type: "rightAligned", valueFormatter: p => formatEuro(p.value) },
    { field: "singola.totaleIva", headerName: "IVA €", type: "rightAligned", valueFormatter: p => formatEuro(p.value) },
    {
      field: "singola.totaleDaPagare",
      headerName: "Da pagare €",
      type: "rightAligned",
      valueFormatter: p => formatEuro(p.value),
    },
  ]);

  const cliente = fornitura?.cliente;
  const offerta = fornitura?.offerta;
  const prezzoOfferta = offerta
    ? offerta.pun
      ? "PUN"
      : [offerta.f1, offerta.f2, offerta.f3].map(p => formatNumero(p, 6)).join(" / ") + " €/kWh"
    : "";

  return (
    <Container fluid className="flex-grow-1">
      <h1>Fornitura - {id}</h1>
      {fornitura && (
        <Row className="g-3 mb-3">
          <Col lg={4}>
            <Scheda
              titolo="Fornitura"
              azioni={
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="me-2"
                  title="modifica fornitura"
                  onClick={() => dispatch(showAddFornituraModalAction(fornitura.id))}>
                  <i className="bi bi-pencil"></i>
                </Button>
              }
              righe={[
                ["POD", <span key="pod" className="font-monospace">{fornitura.id}</span>],
                [
                  "Indirizzo",
                  `${fornitura.indirizzo ?? ""}, ${fornitura.cap ?? ""} ${fornitura.comune ?? ""} (${fornitura.provincia ?? ""})`,
                ],
                ["Tipologia", `${fornitura.bta} · ${fornitura.tipoPrelievo}`],
                [
                  "Potenza",
                  `impegnata ${formatNumero(fornitura.potenzaImpegnata)} kW · disponibile ${formatNumero(fornitura.potenzaDisponibile)} kW`,
                ],
                ["Contatore", fornitura.tipoContatore],
                ["Distributore", fornitura.codiceDistributore],
                ["Fatturazione", fornitura.fatturazione],
                ["IVA", `${formatNumero(fornitura.iva)}%`],
                [
                  "Switch",
                  `${formatData(fornitura.dataSwitch)}${fornitura.dataSwitchOut ? " → uscita " + formatData(fornitura.dataSwitchOut) : ""}`,
                ],
                ...(fornitura.rettificaProgrammazione
                  ? ([
                      ["Rettifica programmazione", `${formatEuro(fornitura.rettificaProgrammazione)} €/mese`],
                    ] as [string, ReactNode][])
                  : []),
              ]}
            />
          </Col>
          <Col lg={4}>
            <Scheda
              titolo="Cliente"
              righe={[
                ["Ragione sociale", <Link key="cliente" to={`/cliente/${cliente?.id}`}>{cliente?.ragioneSociale}</Link>],
                ["Codice", cliente?.id],
                ["P. IVA", cliente?.pIva],
                ["Codice fiscale", cliente?.cf],
                [
                  "Indirizzo",
                  `${cliente?.indirizzo ?? ""}, ${cliente?.cap ?? ""} ${cliente?.comune ?? ""} (${cliente?.provincia ?? ""})`,
                ],
                ["Telefono", cliente?.telefono],
                ["Email", cliente?.email],
                ["Attivo", siNo(cliente?.active)],
              ]}
            />
          </Col>
          <Col lg={4}>
            <Scheda
              titolo={offerta ? `Offerta - ${offerta.nome}` : "Offerta"}
              azioni={
                <div className="me-2 d-flex gap-1">
                  {offerta && (
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      title="modifica offerta (vale per tutte le forniture che la usano)"
                      onClick={() => dispatch(showAddOffertaModalAction(offerta.id))}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    title="associa un'altra offerta esistente"
                    onClick={apriCambioOfferta}>
                    <i className="bi bi-arrow-left-right"></i>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    title="crea una nuova offerta e associala a questa fornitura"
                    onClick={() => fornitura && dispatch(showNuovaOffertaFornituraModalAction(fornitura.id))}>
                    <i className="bi bi-plus-lg"></i>
                  </Button>
                </div>
              }
              righe={
                offerta
                  ? [
                      ["Codice", offerta.codice],
                      ["Tipo", offerta.tipo],
                      ["Prezzo F1 / F2 / F3", prezzoOfferta],
                      ["Spread", offerta.hasSpread ? `${formatNumero(offerta.spread, 6)} €/kWh` : "No"],
                      [
                        "Maggiorazione capacità",
                        offerta.capacitaMaggiorazione ? `${formatNumero(offerta.maggiorazione, 6)} €/kWh` : "No",
                      ],
                      [
                        "OCV",
                        `${formatNumero(offerta.ocv, 6)} ${offerta.modalitaProgrammazione === "CLASSIC" ? "% spesa energia" : "€/kWh"}`,
                      ],
                      ["OCF", `${formatEuro(offerta.ocf)} €/mese`],
                      ["Validità", `${formatData(offerta.dataInizio)} - ${formatData(offerta.dataFine)}`],
                      ["Descrizione", offerta.descrizione],
                    ]
                  : []
              }>
              {!offerta && !cambioOfferta && (
                <div className="text-warning p-2">Nessuna offerta associata: la fornitura non può essere fatturata.</div>
              )}
              {cambioOfferta && (
                <div className="border-top p-2">
                  <div className="d-flex gap-2 align-items-center">
                    <Form.Select size="sm" value={offertaScelta} onChange={e => setOffertaScelta(e.target.value)}>
                      <option value="">scegli un&apos;offerta...</option>
                      {offerte.map(o => (
                        <option key={o.id} value={o.id}>
                          {o.nome}
                          {o.codice ? ` (${o.codice})` : ""}
                          {o.pun ? " - PUN" : o.f1 != null ? ` - ${formatNumero(o.f1, 6)} €/kWh` : ""}
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={!offertaScelta || offertaScelta === String(offerta?.id ?? "")}
                      onClick={confermaCambioOfferta}>
                      Associa
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setCambioOfferta(false)}>
                      Annulla
                    </Button>
                  </div>
                  <div className="small text-body-secondary mt-1">
                    Vale per le fatture calcolate da ora in poi: quelle già emesse non cambiano finché non vengono
                    rigenerate.
                  </div>
                  {erroreOfferta && (
                    <Alert variant="danger" className="py-1 mt-2 mb-0">
                      {erroreOfferta}
                    </Alert>
                  )}
                </div>
              )}
            </Scheda>
          </Col>
        </Row>
      )}

      <div className="border rounded-3 bg-body-tertiary mb-3">
        <h3 className="m-2">Ultime fatture</h3>
        {fatture.length === 0 ? (
          <div className="m-2">Nessuna fattura emessa per questa fornitura.</div>
        ) : (
          <div className="ag-theme-quartz-dark">
            <AgGridReact
              rowData={fatture}
              columnDefs={colDefs}
              autoSizeStrategy={{ type: "fitCellContents" }}
              domLayout="autoHeight"
              enableCellTextSelection={true}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default Fornitura;
