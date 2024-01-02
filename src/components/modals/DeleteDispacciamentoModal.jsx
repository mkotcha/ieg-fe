import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { hideDeleteDispacciamentoModalAction } from "../../redux/actions";

const DeleteDispacciamentoModal = () => {
  const dispatch = useDispatch();
  const showDeleteDispacciamentoModal = useSelector(state => state.modal.showDeleteDispacciamentoModal);
  const token = useSelector(state => state.auth.token);
  const id = useSelector(state => state.modal.deleteDispacciamentoId);

  const handleDelete = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/dispacciamento/` + id;
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    dispatch(hideDeleteDispacciamentoModalAction());
  };

  return (
    <>
      <Modal show={showDeleteDispacciamentoModal} onHide={() => dispatch(hideDeleteDispacciamentoModalAction())}>
        <Modal.Header closeButton>
          <Modal.Title>Elimina dispacciamento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Sei sicuro di voler eliminare il dispacciamento?</p>
          <p>L&apos; operazione è irreversibile!</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => dispatch(hideDeleteDispacciamentoModalAction())}>
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

export default DeleteDispacciamentoModal;
