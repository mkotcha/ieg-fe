import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Form, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { VerificaLetture as VerificaLettureType } from "../types";
import { erroreApi } from "../utils/erroreApi";

const formatData = (d: string | null) => (d ? new Date(d).toLocaleDateString("it-IT") : "");

const ORIGINI: Record<VerificaLettureType["origineInizio"], string> = {
  FATTURA_PRECEDENTE: "fattura precedente",
  LETTURA_SWITCH: "lettura di switch",
  FINE_MESE_PRECEDENTE: "fine mese precedente",
};

/**
 * Verifica delle letture del mese per tutte le forniture che la generazione massiva fatturerebbe, con lo stesso
 * periodo del calcolo della fattura: segnala letture mancanti all'inizio o a fine mese, letture stimate e forniture
 * non fatturabili.
 */
const VerificaLetture = ({ mese, anno }: { mese: number; anno: number }) => {
  const token = useAppSelector(state => state.auth.token);
  const [esiti, setEsiti] = useState<VerificaLettureType[] | null>(null);
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [tutte, setTutte] = useState(false);

  // il risultato vale per il mese verificato
  useEffect(() => {
    setEsiti(null);
  }, [mese, anno]);

  const verifica = async () => {
    setCaricamento(true);
    setErrore(null);
    try {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/letture/verifica?mese=${mese}&anno=${anno}`;
      const response = await axios.get<VerificaLettureType[]>(url, { headers: { Authorization: `Bearer ${token}` } });
      setEsiti(response.data);
    } catch (error) {
      setErrore(erroreApi(error, "Errore durante la verifica delle letture"));
    } finally {
      setCaricamento(false);
    }
  };

  const conProblemi = esiti?.filter(e => e.problemi.length > 0) ?? [];
  const nonFatturabili = esiti?.filter(e => !e.fatturabile).length ?? 0;
  // prima le non fatturabili, poi per cliente
  const righe = (tutte ? (esiti ?? []) : conProblemi)
    .slice()
    .sort((a, b) => Number(a.fatturabile) - Number(b.fatturabile) || a.ragioneSociale.localeCompare(b.ragioneSociale));

  return (
    <div className="my-2">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <span>verifica letture del mese:</span>
        <Button onClick={verifica} size="sm" variant="warning" disabled={caricamento}>
          {caricamento ? <Spinner animation="border" size="sm" /> : "verifica"}
        </Button>
        {esiti && (
          <>
            <span className={conProblemi.length ? "text-warning" : "text-success"}>
              forniture con problemi: {conProblemi.length} / {esiti.length}
            </span>
            {nonFatturabili > 0 && <span className="text-danger">· non fatturabili: {nonFatturabili}</span>}
            <Form.Check
              type="switch"
              id="verifica-tutte"
              label="mostra tutte"
              className="ms-2"
              checked={tutte}
              onChange={e => setTutte(e.target.checked)}
            />
          </>
        )}
      </div>
      {errore && (
        <Alert variant="danger" className="py-2 mt-2">
          {errore}
        </Alert>
      )}
      {esiti && righe.length > 0 && (
        <Table size="sm" striped bordered className="mt-2 small">
          <thead>
            <tr>
              <th>POD</th>
              <th>Cliente</th>
              <th>Periodo fattura</th>
              <th>Inizio da</th>
              <th className="text-end">Letture</th>
              <th>Prima - ultima</th>
              <th>Problemi</th>
            </tr>
          </thead>
          <tbody>
            {righe.map(e => (
              <tr key={e.pod}>
                <td className="font-monospace">
                  <Link to={`/letture/${e.pod}`} className="text-decoration-none text-reset">
                    {e.pod}
                  </Link>
                </td>
                <td>
                  <Link to={`/cliente/${e.clienteId}`} className="text-decoration-none text-reset">
                    {e.ragioneSociale}
                  </Link>
                </td>
                <td className="text-nowrap">
                  {formatData(e.dal)} - {formatData(e.al)}
                </td>
                <td>{ORIGINI[e.origineInizio]}</td>
                <td className="text-end">{e.letture}</td>
                <td className="text-nowrap">
                  {formatData(e.primaLettura)} - {formatData(e.ultimaLettura)}
                  {e.tipoUltimaLettura === "STIMA" && <span className="text-warning"> (stima)</span>}
                </td>
                <td className={!e.fatturabile ? "text-danger" : e.problemi.length ? "text-warning" : "text-success"}>
                  {e.problemi.length ? e.problemi.join("; ") : "OK"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default VerificaLetture;
