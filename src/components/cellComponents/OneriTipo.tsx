import type { ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { showAddOneriModalAction, showDeleteOneriModalAction } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";
import type { Oneri } from "../../types";

const OneriTipo = (params: ICellRendererParams<Oneri>) => {
  const dispatch = useAppDispatch();
  return (
    <div className="d-flex ">
      <div className="me-auto">{params.data?.tipo}</div>
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => dispatch(showAddOneriModalAction(params.data?.id))}
        className="my-auto me-1">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => dispatch(showDeleteOneriModalAction(params.data?.id))}
        className="my-auto">
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
};

export default OneriTipo;
