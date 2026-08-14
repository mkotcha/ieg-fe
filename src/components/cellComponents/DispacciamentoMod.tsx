import type { ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { showAddDispacciamentoModalAction, showDeleteDispacciamentoModalAction } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";
import type { Dispacciamento } from "../../types";

const DispacciamentoMod = (params: ICellRendererParams<Dispacciamento>) => {
  const dispatch = useAppDispatch();
  return (
    <div className="d-flex ms-3">
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => dispatch(showAddDispacciamentoModalAction(params.data?.id))}
        className=" me-1">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => dispatch(showDeleteDispacciamentoModalAction(params.data?.id))}
        className="">
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
};

export default DispacciamentoMod;
