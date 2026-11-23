import type { ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { showAddUtenteModalAction, showDeleteUtenteModalAction } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";
import type { Utente } from "../../types";

const UtenteUsername = (params: ICellRendererParams<Utente>) => {
  const dispatch = useAppDispatch();
  return (
    <div className="d-flex ">
      <div className="me-auto">{params.data?.username}</div>
      <Button
        size="sm"
        variant="outline-secondary"
        title="modifica (dati, ruolo, password)"
        onClick={() => dispatch(showAddUtenteModalAction(params.data?.id))}
        className="my-auto ms-2 me-1">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        size="sm"
        variant="outline-danger"
        title="elimina"
        onClick={() => dispatch(showDeleteUtenteModalAction(params.data?.id))}
        className="my-auto">
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
};

export default UtenteUsername;
