import axios from "axios";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

/** Nome del file mandato dal backend in X-Filename (url-encoded: "<numero> - <ragione sociale>.pdf"). */
const nomeFile = (header: string | undefined) => {
  if (!header) return "fattura";
  try {
    return decodeURIComponent(header);
  } catch {
    return header;
  }
};

/**
 * Pulsanti di una fattura nelle celle delle tabelle: confronto con il fornitore (se confronto), excel e pdf.
 * Il pdf si apre in una nuova scheda e viene anche scaricato; l'excel viene scaricato.
 */
const PulsantiFattura = ({ numero, confronto = true }: { numero: string; confronto?: boolean }) => {
  const token = useAppSelector(state => state.auth.token);

  const scarica = async (formato: "pdf" | "xlsx") => {
    const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/fatture/${numero}/${formato}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    if (response.status !== 200) return;
    const url = window.URL.createObjectURL(response.data);
    if (formato === "pdf") window.open(url, "_blank");
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nomeFile(response.headers["x-filename"] as string | undefined));
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="d-flex gap-1 ms-auto ps-2">
      {confronto && (
        <Link
          to={`/fatture/${numero}/confronto`}
          className="btn btn-sm btn-secondary border border-0"
          title="confronto con il fornitore">
          <i className="bi bi-arrow-left-right"></i>
        </Link>
      )}
      <Button size="sm" variant="success" onClick={() => scarica("xlsx")} className="border border-0" title="excel">
        <i className="bi bi-table"></i>
      </Button>
      <Button size="sm" variant="danger" onClick={() => scarica("pdf")} className="border border-0" title="pdf">
        <i className="bi bi-file-pdf-fill"></i>
      </Button>
    </div>
  );
};

export default PulsantiFattura;
