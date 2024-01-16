import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { showAddDispacciamentoModalAction, showDeleteDispacciamentoModalAction } from "../../redux/actions";
import { Button } from "react-bootstrap";

const DispacciamentoMod = props => {
  const dispatch = useDispatch();
  return (
    <div className="d-flex ms-3">
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => dispatch(showAddDispacciamentoModalAction(props.data.id))}
        className=" me-1">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => dispatch(showDeleteDispacciamentoModalAction(props.data.id))}
        className="">
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
};

DispacciamentoMod.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default DispacciamentoMod;
