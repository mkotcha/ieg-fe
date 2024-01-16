import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { showAddFornituraModalAction, showDeleteFornituraModalAction } from "../../redux/actions";
import { Link } from "react-router-dom";

const FornituraPod = params => {
  const dispatch = useDispatch();
  return (
    <div className="d-flex ">
      <div className="me-auto ">
        <Link to={`/cliente/${params.data.cliente.id}`} className="text-decoration-none text-reset">
          {params.data.id}
        </Link>
      </div>
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => dispatch(showAddFornituraModalAction(params.data.id))}
        className="my-auto me-1">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => dispatch(showDeleteFornituraModalAction(params.data.id))}
        className="my-auto">
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
};

export default FornituraPod;
