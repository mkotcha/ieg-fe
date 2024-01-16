import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideDeleteClienteModalAction } from "../../redux/actions";
import { Button, Modal } from "react-bootstrap";

const DeleteClienteModal = () => {
  const dispatch = useDispatch();
  const showDeleteClienteModal = useSelector(state => state.modal.showDeleteClienteModal);
  const token = useSelector(state => state.auth.token);
  const id = useSelector(state => state.modal.deleteClienteId);

  const handleDelete = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti/` + id;
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    dispatch(hideDeleteClienteModalAction());
  };

  return (
    <>
      <Modal show={showDeleteClienteModal} onHide={() => dispatch(hideDeleteClienteModalAction())}>
        <Modal.Header closeButton>
          <Modal.Title>Elimina cliente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Sei sicuro di voler eliminare il cliente?</p>
          <p>L&apos; operazione è irreversibile!</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => dispatch(hideDeleteClienteModalAction())}>
            Annulla
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteClienteModal;
