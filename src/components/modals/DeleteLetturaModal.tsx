import { Button, Modal } from "react-bootstrap";
import { hideDeleteLetturaModalAction } from "../../redux/actions";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const DeleteLetturaModal = () => {
  const dispatch = useAppDispatch();
  const showDeleteLetturaModal = useAppSelector(state => state.modal.showDeleteLetturaModal);
  const token = useAppSelector(state => state.auth.token);
  const id = useAppSelector(state => state.modal.deleteLetturaId);
  const handleDelete = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/letture/` + id;
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(response);
    dispatch(hideDeleteLetturaModalAction());
  };

  return (
    <>
      <Modal show={showDeleteLetturaModal} onHide={() => dispatch(hideDeleteLetturaModalAction())}>
        <Modal.Header closeButton>
          <Modal.Title>Elimina lettura</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Sei sicuro di voler eliminare la lettura?</p>
          <p>L&apos; operazione è irreversibile!</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => dispatch(hideDeleteLetturaModalAction())}>
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

export default DeleteLetturaModal;
