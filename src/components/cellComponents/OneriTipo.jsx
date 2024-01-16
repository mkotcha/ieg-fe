import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { showAddOneriModalAction, showDeleteOneriModalAction } from "../../redux/actions";
import PropTypes from 'prop-types';

const OneriTipo = props => {
    const dispatch = useDispatch();
    return (
        <div className="d-flex ">
            <div className="me-auto">{props.data.tipo}</div>
            <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => dispatch(showAddOneriModalAction(props.data.id))}
                className="my-auto me-1">
                <i className="bi bi-pencil"></i>
            </Button>
            <Button
                size="sm"
                variant="outline-danger"
                onClick={() => dispatch(showDeleteOneriModalAction(props.data.id))}
                className="my-auto">
                <i className="bi bi-trash"></i>
            </Button>
        </div>
    );
}

OneriTipo.propTypes = {
        data: PropTypes.shape({
            id: PropTypes.number.isRequired,
            tipo: PropTypes.string.isRequired,
        }).isRequired,
};

export default OneriTipo;