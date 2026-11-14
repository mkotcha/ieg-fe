import type { ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { showAddOffertaModalAction, showDeleteOffertaModalAction } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";
import type { Offerta } from "../../types";

const OffertaNome = (params: ICellRendererParams<Offerta>) => {
  const dispatch = useAppDispatch();
  return (
    <div className="d-flex ">
      <div className="me-auto">{params.data?.nome}</div>
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => dispatch(showAddOffertaModalAction(params.data?.id))}
        className="my-auto ms-2 me-1">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => dispatch(showDeleteOffertaModalAction(params.data?.id))}
        className="my-auto">
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
};

export default OffertaNome;
