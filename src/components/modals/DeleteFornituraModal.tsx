import axios from "axios";
import { hideDeleteFornituraModalAction } from "../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const DeleteFornituraModal = () => {
  const dispatch = useAppDispatch();
  const showDeleteFornituraModal = useAppSelector(state => state.modal.showDeleteFornituraModal);
  const token = useAppSelector(state => state.auth.token);
  const id = useAppSelector(state => state.modal.deleteFornituraId);

  const handleDelete = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture/` + id;
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    dispatch(hideDeleteFornituraModalAction());
  };

  return (
    <>
      <Modal show={showDeleteFornituraModal} onHide={() => dispatch(hideDeleteFornituraModalAction())}>
        <Modal.Header closeButton>
          <Modal.Title>Elimina fornitura</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Sei sicuro di voler eliminare la fornitura?</p>
          <p>L&apos; operazione è irreversibile!</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => dispatch(hideDeleteFornituraModalAction())}>
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

export default DeleteFornituraModal;
