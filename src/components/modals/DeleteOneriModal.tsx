import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { hideDeleteOneriModalAction } from "../../redux/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const DeleteOneriModal = () => {
  const dispatch = useAppDispatch();
  const showDeleteOneriModal = useAppSelector(state => state.modal.showDeleteOneriModal);
  const token = useAppSelector(state => state.auth.token);
  const id = useAppSelector(state => state.modal.deleteOneriId);
  const handleDelete = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/oneri/` + id;
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    dispatch(hideDeleteOneriModalAction());
  };

  return (
    <>
      <Modal show={showDeleteOneriModal} onHide={() => dispatch(hideDeleteOneriModalAction())}>
        <Modal.Header closeButton>
          <Modal.Title>Elimina oneri</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Sei sicuro di voler eliminare gli oneri?</p>
          <p>L&apos; operazione è irreversibile!</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => dispatch(hideDeleteOneriModalAction())}>
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

export default DeleteOneriModal;
