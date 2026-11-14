import type { ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { showAddOffertaModalAction } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";
import type { Fornitura } from "../../types";

/** Nome dell'offerta di una fornitura, con la matita che apre la modifica dell'offerta (non della fornitura). */
const FornituraOfferta = (params: ICellRendererParams<Fornitura>) => {
  const dispatch = useAppDispatch();
  const offerta = params.data?.offerta;
  if (!offerta) return <span className="text-warning">nessuna offerta</span>;
  return (
    <div className="d-flex">
      <div className="me-auto">{offerta.nome}</div>
      <Button
        size="sm"
        variant="outline-secondary"
        title="modifica offerta"
        onClick={() => dispatch(showAddOffertaModalAction(offerta.id))}
        className="my-auto ms-2">
        <i className="bi bi-pencil"></i>
      </Button>
    </div>
  );
};

export default FornituraOfferta;
