import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

const LetturaPod = props => {
  return (
    <div className="d-flex ">
      <div className="me-auto">{props.data.fornitura.id}</div>

      <Button size="sm" variant="outline-secondary" className="my-auto me-1">
        <i className="bi bi-pencil"></i>
      </Button>
      <Button size="sm" variant="outline-danger" className="my-auto">
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
};

LetturaPod.propTypes = {
  data: PropTypes.shape({
    fornitura: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default LetturaPod;
