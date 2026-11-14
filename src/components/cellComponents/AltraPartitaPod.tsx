import type { ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { showAddAltraPartitaModalAction, showDeleteAltraPartitaModalAction } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";
import type { AltraPartita } from "../../types";

const AltraPartitaPod = (params: ICellRendererParams<AltraPartita>) => {
  const dispatch = useAppDispatch();
  return (
    <div className="d-flex ">
      <Link to={`/fornitura/${params.data?.fornitura?.id}`} className="me-auto text-decoration-none text-reset">
        {params.data?.fornitura?.id}
      </Link>
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => dispatch(showAddAltraPartitaModalAction(params.data?.id))}
        className="my-auto ms-2 me-1">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => dispatch(showDeleteAltraPartitaModalAction(params.data?.id))}
        className="my-auto">
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
};

export default AltraPartitaPod;
