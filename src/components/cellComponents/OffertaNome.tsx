import type { ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { showAddOffertaModalAction, showCopiaOffertaModalAction, showDeleteOffertaModalAction } from "../../redux/actions";
import { useAppDispatch, useIsAdmin } from "../../redux/hooks";
import type { Offerta } from "../../types";

const OffertaNome = (params: ICellRendererParams<Offerta>) => {
  const dispatch = useAppDispatch();
  const isAdmin = useIsAdmin();
  return (
    <div className="d-flex ">
      <div className="me-auto">{params.data?.nome}</div>
      {isAdmin && (
        <>
          <Button
            size="sm"
            variant="outline-secondary"
            title="modifica"
            onClick={() => dispatch(showAddOffertaModalAction(params.data?.id))}
            className="my-auto ms-2 me-1">
            <i className="bi bi-pencil"></i>
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            title="nuova offerta da questa"
            onClick={() => dispatch(showCopiaOffertaModalAction(params.data?.id))}
            className="my-auto me-1">
            <i className="bi bi-copy"></i>
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            title="elimina"
            onClick={() => dispatch(showDeleteOffertaModalAction(params.data?.id))}
            className="my-auto">
            <i className="bi bi-trash"></i>
          </Button>
        </>
      )}
    </div>
  );
};

export default OffertaNome;
