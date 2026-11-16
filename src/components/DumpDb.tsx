import axios from "axios";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useAppSelector } from "../redux/hooks";
import { erroreApi } from "../utils/erroreApi";

/**
 * Pulsante che scarica il dump del database (pg_dump -Fc, da ripristinare con pg_restore). Riservato agli ADMIN.
 */
const DumpDb = () => {
  const token = useAppSelector(state => state.auth.token);
  const [inCorso, setInCorso] = useState(false);

  const scaricaDump = async () => {
    setInCorso(true);
    try {
      const response = await axios.get<Blob>(`${import.meta.env.VITE_REACT_APP_API_URL}/db/dump`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", (response.headers["x-filename"] as string | undefined) ?? "ieg.dump");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // con responseType blob anche il json d'errore del backend arriva come blob: va riletto
      if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
        try {
          error.response.data = JSON.parse(await error.response.data.text());
        } catch {
          // non è json: resta il messaggio generico
        }
      }
      window.alert(erroreApi(error, "Errore durante il dump del database"));
    } finally {
      setInCorso(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline-secondary"
      className="me-3"
      onClick={scaricaDump}
      disabled={inCorso}
      title="scarica il dump del database">
      {inCorso ? <Spinner animation="border" size="sm" /> : <i className="bi bi-database-down"></i>} backup db
    </Button>
  );
};

export default DumpDb;
