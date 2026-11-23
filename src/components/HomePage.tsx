import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Alert, Button, Container, Form, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useIsAdmin } from "../redux/hooks";
import ConfrontoFornitore from "./ConfrontoFornitore";
import AvanzamentoLavoro from "./AvanzamentoLavoro";
import { useLavoro } from "../hooks/useLavoro";
import type { Cliente, EsitoFattura, Fattura, Fornitura, PagedResponse } from "../types";
import VerificaLetture from "./VerificaLetture";
import ZipFatture from "./ZipFatture";

const HomePage = () => {
  const [clienti, setClienti] = useState<Cliente[] | null>(null);
  const [forniture, setForniture] = useState<Fornitura[] | null>(null);
  const [fatture, setFatture] = useState<Fattura[] | null>(null);
  // generazione in background: esiti per cliente nel risultato del lavoro completato
  const generazione = useLavoro<EsitoFattura[]>("GENERAZIONE_FATTURE");
  const esiti = generazione.lavoro?.stato === "COMPLETATO" ? generazione.lavoro.risultato : null;
  const currentMonth = new Date().getMonth();
  const [mese, setMese] = useState<number | string>(currentMonth === 0 ? 12 : currentMonth);
  const [anno, setAnno] = useState<number | string>(
    currentMonth === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear()
  );
  const token = useAppSelector(state => state.auth.token);
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    // scarica tutti gli elementi di un endpoint paginato: se la prima pagina non li contiene tutti,
    // li richiede di nuovo con size = totalElements
    const fetchTutti = async <T,>(path: string): Promise<T[]> => {
      const get = (size: number) =>
        axios.get<PagedResponse<T>>(`${import.meta.env.VITE_REACT_APP_API_URL}/${path}?size=${size}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      const response = await get(500);
      const totale = response.data.totalElements ?? response.data.page?.totalElements ?? response.data.content.length;
      if (totale <= response.data.content.length) return response.data.content;
      return (await get(totale)).data.content;
    };
    const fetchClienti = async () => setClienti(await fetchTutti<Cliente>("clienti"));
    const fetchForniture = async () => setForniture(await fetchTutti<Fornitura>("forniture"));
    const fetchFatture = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/fatture`;
      const response = await axios.get<Fattura[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFatture(response.data);
    };

    if (clienti === null) fetchClienti();
    if (forniture === null) fetchForniture();
    if (fatture === null) fetchFatture();
  }, [clienti, fatture, forniture, token]);

  const generaFatture = async () => {
    if (!window.confirm(`Generare le fatture di ${mese}/${anno} per tutti i clienti attivi?`)) return;
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/fatture/genera?mese=${mese}&anno=${anno}`;
    await generazione.avvia(() => axios.post(url, null, { headers: { Authorization: `Bearer ${token}` } }));
  };

  // a generazione terminata ricarica il conteggio delle fatture emesse
  const statoGenerazione = generazione.lavoro?.stato;
  useEffect(() => {
    if (statoGenerazione === "COMPLETATO") setFatture(null);
  }, [statoGenerazione]);

  const formatEuro = (n: number | null) =>
    n === null ? "" : n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fattureDelPeriodo = fatture?.filter(f => f.mese === Number(mese) && f.anno === Number(anno));
  // stesso criterio della generazione massiva: cliente attivo e con almeno una fornitura
  const clientiConForniture = new Set(forniture?.map(f => f.cliente?.id));
  const clientiAttivi = clienti?.filter(c => c.active && clientiConForniture.has(c.id));
  // forniture che la generazione massiva fattura: tutte quelle dei clienti attivi
  const idClientiAttivi = new Set(clientiAttivi?.map(c => c.id));
  const fornitureAttive = forniture?.filter(f => idClientiAttivi.has(f.cliente?.id));
  const esitiOk = esiti?.filter(e => !e.errore) ?? [];

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Container fluid className="content">
      <h1>Home Page</h1>

      <div className="border rounded-3 ">
        <div className="bg-body-tertiary p-2">
          <h3>Riepilogo</h3>
        </div>
        <div className="p-2">
          <div>
            <div>
              totale clienti: {clienti?.length} (attivi: {forniture ? clientiAttivi?.length : ""})
            </div>
          </div>
          <div>
            <div>
              totale forniture: {forniture?.length} (attive: {clienti ? fornitureAttive?.length : ""})
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center">
              <div>Periodo: </div>
              <Form.Select
                style={{ width: "auto" }}
                className="mx-3"
                size="sm"
                onChange={e => setMese(e.target.value)}
                value={mese}>
                <option value="1">Gennaio</option>
                <option value="2">Febbraio</option>
                <option value="3">Marzo</option>
                <option value="4">Aprile</option>
                <option value="5">Maggio</option>
                <option value="6">Giugno</option>
                <option value="7">Luglio</option>
                <option value="8">Agosto</option>
                <option value="9">Settembre</option>
                <option value="10">Ottobre</option>
                <option value="11">Novembre</option>
                <option value="12">Dicembre</option>
              </Form.Select>
              <Form.Select style={{ width: "auto" }} size="sm" onChange={e => setAnno(e.target.value)} value={anno}>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </Form.Select>
            </div>
            <div>
              totale fatture emesse nel periodo: {fattureDelPeriodo?.length} / {forniture ? clientiAttivi?.length : ""}
              {isAdmin && (
                <Button
                  onClick={generaFatture}
                  size="sm"
                  variant="primary"
                  className="mx-2"
                  disabled={generazione.inCorso}>
                  {generazione.inCorso ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-1" /> generazione in corso...
                    </>
                  ) : (
                    "genera fatture"
                  )}
                </Button>
              )}
              <ZipFatture mese={Number(mese)} anno={Number(anno)} />
            </div>
            {generazione.errore && (
              <Alert variant="danger" className="my-2 py-2">
                {generazione.errore}
              </Alert>
            )}
            {generazione.lavoro && <AvanzamentoLavoro lavoro={generazione.lavoro} onChiudi={generazione.chiudi} />}
            {esiti && (
              <div className="my-2">
                <div>
                  fatture generate: {esitiOk.length} / {esiti.length} - totale da pagare:{" "}
                  {formatEuro(esitiOk.reduce((acc, e) => acc + (e.totale ?? 0), 0))} €
                </div>
                <Table size="sm" striped bordered className="mt-2 w-auto">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Numero fattura</th>
                      <th className="text-end">Totale da pagare</th>
                      <th className="text-end">ms</th>
                      <th>Esito</th>
                    </tr>
                  </thead>
                  <tbody>
                    {esiti.map(e => (
                      <tr key={e.clienteId}>
                        <td>
                          <Link to={`/cliente/${e.clienteId}`} className="text-decoration-none text-reset">
                            {e.ragioneSociale}
                          </Link>
                        </td>
                        <td className="font-monospace">{e.numeroFattura}</td>
                        <td className="text-end">{formatEuro(e.totale)}</td>
                        <td className="text-end">{e.millisecondi.toLocaleString("it-IT")}</td>
                        <td className={e.errore ? "text-danger" : "text-success"}>{e.errore ?? "OK"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            <VerificaLetture mese={Number(mese)} anno={Number(anno)} />
          </div>
        </div>
      </div>

      <ConfrontoFornitore mese={Number(mese)} anno={Number(anno)} />
    </Container>
  );
};

export default HomePage;
