import axios from "axios";
import { useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useAppSelector } from "../redux/hooks";
import type { ParteZip } from "../types";

const formatMb = (byte: number) =>
  (byte / 1024 / 1024).toLocaleString("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * Pulsante che scarica i pdf delle fatture del mese divisi in più zip, ognuno sotto il limite degli allegati
 * email (la divisione è fatta dal backend). Gli zip vengono scaricati uno dopo l'altro.
 */
const ZipFatture = ({ mese, anno }: { mese: number; anno: number }) => {
  const token = useAppSelector(state => state.auth.token);
  const [parti, setParti] = useState<ParteZip[] | null>(null);
  const [inCorso, setInCorso] = useState<number | null>(null);
  const [errore, setErrore] = useState<string | null>(null);

  const scaricaZip = async () => {
    setErrore(null);
    setParti(null);
    const headers = { Authorization: `Bearer ${token}` };
    const base = `${import.meta.env.VITE_REACT_APP_API_URL}/fatture/zip`;
    try {
      const { data } = await axios.get<ParteZip[]>(`${base}?mese=${mese}&anno=${anno}`, { headers });
      for (const p of data) {
        setInCorso(p.parte);
        const response = await axios.get<Blob>(`${base}/${p.parte}?mese=${mese}&anno=${anno}`, {
          headers,
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", p.nomeFile);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
      setParti(data);
    } catch (e) {
      setErrore(
        axios.isAxiosError(e) && e.response?.status === 404
          ? `Nessun pdf per le fatture di ${mese}/${anno}`
          : "Errore nella preparazione degli zip"
      );
    } finally {
      setInCorso(null);
    }
  };

  return (
    <>
      <Button onClick={scaricaZip} size="sm" variant="secondary" disabled={inCorso !== null}>
        {inCorso !== null ? (
          <>
            <Spinner animation="border" size="sm" className="me-1" /> zip {inCorso}...
          </>
        ) : (
          <>
            <i className="bi bi-file-zip me-1"></i>zip per email
          </>
        )}
      </Button>
      {errore && (
        <Alert variant="danger" className="my-2 py-2">
          {errore}
        </Alert>
      )}
      {parti && (
        <div className="my-2">
          scaricati {parti.length} zip:
          <ul className="mb-0">
            {parti.map(p => (
              <li key={p.parte}>
                {p.nomeFile}: {p.fatture} fatture, {formatMb(p.dimensione)} MB
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ZipFatture;
