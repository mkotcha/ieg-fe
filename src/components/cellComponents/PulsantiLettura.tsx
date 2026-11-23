import axios from "axios";
import { Button } from "react-bootstrap";
import { showAddLetturaModalAction, showDeleteLetturaModalAction } from "../../redux/actions";
import { useAppDispatch, useAppSelector, useIsAdmin } from "../../redux/hooks";
import type { Lettura } from "../../types";

/**
 * Pulsanti di una lettura nelle celle delle tabelle: attiva/disattiva, modifica ed elimina (solo ADMIN).
 * Dopo l'attivazione/disattivazione chiama ricarica (di solito passata nel context della tabella).
 */
const PulsantiLettura = ({ lettura, ricarica }: { lettura: Lettura | undefined; ricarica?: () => void }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const attiva = lettura?.attiva !== false;
  const isAdmin = useIsAdmin();

  // le letture disattivate restano in tabella ma non entrano nei calcoli
  const cambiaAttiva = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/letture/${lettura?.id}/attiva?attiva=${!attiva}`;
    await axios.put(url, null, { headers: { Authorization: `Bearer ${token}` } });
    ricarica?.();
  };

  // per chi è in sola lettura nessun pulsante
  if (!isAdmin) return null;

  return (
    <>
      <Button
        size="sm"
        variant={attiva ? "outline-success" : "outline-secondary"}
        onClick={cambiaAttiva}
        className="my-auto me-1"
        title={attiva ? "disattiva la lettura" : "attiva la lettura"}>
        <i className={attiva ? "bi bi-toggle-on" : "bi bi-toggle-off"}></i>
      </Button>
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => dispatch(showAddLetturaModalAction(lettura?.id))}
        className="my-auto me-1"
        title="modifica la lettura">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => dispatch(showDeleteLetturaModalAction(lettura?.id))}
        className="my-auto"
        title="elimina la lettura">
        <i className="bi bi-trash"></i>
      </Button>
    </>
  );
};

export default PulsantiLettura;
