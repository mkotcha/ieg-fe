import PropTypes from "prop-types";

const LetturaPod = props => {
  return (
    <div>
      <p>{props.data.fornitura.id}</p>
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
