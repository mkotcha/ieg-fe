import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { hideUploadModalAction } from "../../redux/actions";

const UploadFlussiModal = () => {
  const token = useSelector(state => state.auth.token);
  const showUploadModal = useSelector(state => state.modal.showUploadModal);
  const dispatch = useDispatch();

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const file = event.target.elements.namedItem("flussi").files[0];
    formData.append("flussi", file);
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/letture/flussi`;
    const response = await axios.post(url, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    dispatch(hideUploadModalAction());
  };

  return (
    <Modal
      size="lg"
      show={showUploadModal}
      onHide={() => dispatch(hideUploadModalAction())}
      aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Carica flussi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="flussi" className="mb-3">
            <Form.Label>Carica i flussi in formato .zip</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Carica
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UploadFlussiModal;
