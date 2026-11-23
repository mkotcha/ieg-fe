import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { hideDeleteUtenteModalAction } from "../../redux/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { erroreApi } from "../../utils/erroreApi";

const DeleteUtenteModal = () => {
  const dispatch = useAppDispatch();
  const showDeleteUtenteModal = useAppSelector(state => state.modal.showDeleteUtenteModal);
  const token = useAppSelector(state => state.auth.token);
  const id = useAppSelector(state => state.modal.deleteUtenteId);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    setErrore(null);
  }, [showDeleteUtenteModal]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/utenti/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(hideDeleteUtenteModalAction());
    } catch (error) {
      setErrore(erroreApi(error, "Errore durante l'eliminazione dell'utente"));
    }
  };

  return (
    <Modal show={showDeleteUtenteModal} onHide={() => dispatch(hideDeleteUtenteModalAction())}>
      <Modal.Header closeButton>
        <Modal.Title>Elimina utente</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Sei sicuro di voler eliminare l&apos;utente? Non potrà più accedere.</p>
        {errore && <Alert variant="danger">{errore}</Alert>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(hideDeleteUtenteModalAction())}>
          Annulla
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Elimina
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUtenteModal;
