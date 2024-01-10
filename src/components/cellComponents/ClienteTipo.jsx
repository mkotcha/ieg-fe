import { useDispatch } from "react-redux";
import { showAddClienteModalAction, showDeleteClienteModalAction } from "../../redux/actions";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ClienteTipo = params => {
  const dispatch = useDispatch();
  return (
    <div className="d-flex ms-3">
      <Link to={`/cliente/${params.data.id}`} className="text-decoration-none text-reset">
        {params.data.ragioneSociale}
      </Link>
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => dispatch(showAddClienteModalAction(params.data.id))}
        className="ms-auto me-1">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => dispatch(showDeleteClienteModalAction(params.data.id))}
        className="">
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
};

export default ClienteTipo;
