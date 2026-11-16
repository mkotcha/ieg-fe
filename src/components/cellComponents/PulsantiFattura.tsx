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
 * Pulsanti di una fattura nelle celle delle tabelle: confronto con il fornitore (se confronto) e pdf.
 * Il pdf si apre in una nuova scheda e viene anche scaricato.
 */
const PulsantiFattura = ({ numero, confronto = true }: { numero: string; confronto?: boolean }) => {
  const token = useAppSelector(state => state.auth.token);

  const scaricaPdf = async () => {
    const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/fatture/${numero}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    if (response.status !== 200) return;
    const url = window.URL.createObjectURL(response.data);
    window.open(url, "_blank");
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
      <Button size="sm" variant="danger" onClick={scaricaPdf} className="border border-0" title="pdf">
        <i className="bi bi-file-pdf-fill"></i>
      </Button>
    </div>
  );
};

export default PulsantiFattura;
