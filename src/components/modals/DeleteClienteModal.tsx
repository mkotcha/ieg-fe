import axios from "axios";
import { hideDeleteClienteModalAction } from "../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const DeleteClienteModal = () => {
  const dispatch = useAppDispatch();
  const showDeleteClienteModal = useAppSelector(state => state.modal.showDeleteClienteModal);
  const token = useAppSelector(state => state.auth.token);
  const id = useAppSelector(state => state.modal.deleteClienteId);

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
