import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { showAddLetturaModalAction, showDeleteLetturaModalAction } from "../../redux/actions";

const LetturaPod = props => {
  const dispatch = useDispatch();
  return (
    <div className="d-flex ">
      <div className="me-auto">{props.data.fornitura.id}</div>
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => dispatch(showAddLetturaModalAction(props.data.id))}
        className="my-auto me-1">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => dispatch(showDeleteLetturaModalAction(props.data.id))}
        className="my-auto">
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
};

LetturaPod.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fornitura: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default LetturaPod;
