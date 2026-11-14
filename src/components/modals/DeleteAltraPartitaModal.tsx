import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { hideDeleteAltraPartitaModalAction } from "../../redux/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { erroreApi } from "../../utils/erroreApi";

const DeleteAltraPartitaModal = () => {
  const dispatch = useAppDispatch();
  const showDeleteAltraPartitaModal = useAppSelector(state => state.modal.showDeleteAltraPartitaModal);
  const token = useAppSelector(state => state.auth.token);
  const id = useAppSelector(state => state.modal.deleteAltraPartitaId);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    setErrore(null);
  }, [showDeleteAltraPartitaModal]);

  const handleDelete = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/altre-partite/${id}`;
    try {
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(hideDeleteAltraPartitaModalAction());
    } catch (error) {
      setErrore(erroreApi(error, "Errore durante l'eliminazione della partita"));
    }
  };

  return (
    <Modal show={showDeleteAltraPartitaModal} onHide={() => dispatch(hideDeleteAltraPartitaModalAction())}>
      <Modal.Header closeButton>
        <Modal.Title>Elimina partita</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Sei sicuro di voler eliminare la partita?</p>
        <p>L&apos; operazione è irreversibile!</p>
        {errore && <Alert variant="danger">{errore}</Alert>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(hideDeleteAltraPartitaModalAction())}>
          Annulla
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Elimina
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAltraPartitaModal;
