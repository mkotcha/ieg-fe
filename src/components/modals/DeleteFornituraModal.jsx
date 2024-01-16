import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideDeleteFornituraModalAction } from "../../redux/actions";
import { Button, Modal } from "react-bootstrap";

const DeleteFornituraModal = () => {
  const dispatch = useDispatch();
  const showDeleteFornituraModal = useSelector(state => state.modal.showDeleteFornituraModal);
  const token = useSelector(state => state.auth.token);
  const id = useSelector(state => state.modal.deleteFornituraId);

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
          <Modal.Title>Elimina cliente</Modal.Title>
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
