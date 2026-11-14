import type { ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { showAddOffertaModalAction, showCambiaOffertaModalAction } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";
import type { Fornitura } from "../../types";

/**
 * Nome dell'offerta di una fornitura (link alla pagina offerte con le sue forniture), con la matita che modifica
 * l'offerta (non la fornitura) e il pulsante per associarne un'altra.
 */
const FornituraOfferta = (params: ICellRendererParams<Fornitura>) => {
  const dispatch = useAppDispatch();
  const fornitura = params.data;
  const offerta = fornitura?.offerta;
  return (
    <div className="d-flex">
      {offerta ? (
        <Link
          to={`/offerte?id=${offerta.id}`}
          className="me-auto text-decoration-none text-reset"
          title="vai all'offerta e alle sue forniture">
          {offerta.nome}
        </Link>
      ) : (
        <div className="me-auto text-warning">nessuna offerta</div>
      )}
      {offerta && (
        <Button
          size="sm"
          variant="outline-secondary"
          title="modifica offerta (vale per tutte le forniture che la usano)"
          onClick={() => dispatch(showAddOffertaModalAction(offerta.id))}
          className="ms-2 me-1">
          <i className="bi bi-pencil"></i>
        </Button>
      )}
      <Button
        size="sm"
        variant="outline-secondary"
        title={offerta ? "cambia offerta" : "associa un'offerta"}
        onClick={() => fornitura && dispatch(showCambiaOffertaModalAction(fornitura.id))}
        className={offerta ? "" : "ms-2"}>
        <i className="bi bi-arrow-left-right"></i>
      </Button>
    </div>
  );
};

export default FornituraOfferta;
