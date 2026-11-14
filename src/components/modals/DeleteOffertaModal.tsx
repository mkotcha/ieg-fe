import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { hideDeleteOffertaModalAction } from "../../redux/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { erroreApi } from "../../utils/erroreApi";

const DeleteOffertaModal = () => {
  const dispatch = useAppDispatch();
  const showDeleteOffertaModal = useAppSelector(state => state.modal.showDeleteOffertaModal);
  const token = useAppSelector(state => state.auth.token);
  const id = useAppSelector(state => state.modal.deleteOffertaId);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    setErrore(null);
  }, [showDeleteOffertaModal]);

  const handleDelete = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/offerte/${id}`;
    try {
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(hideDeleteOffertaModalAction());
    } catch (error) {
      // il backend rifiuta l'eliminazione se l'offerta è usata da qualche fornitura
      setErrore(erroreApi(error, "Errore durante l'eliminazione dell'offerta"));
    }
  };

  return (
    <Modal show={showDeleteOffertaModal} onHide={() => dispatch(hideDeleteOffertaModalAction())}>
      <Modal.Header closeButton>
        <Modal.Title>Elimina offerta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Sei sicuro di voler eliminare l&apos;offerta?</p>
        <p>L&apos; operazione è irreversibile!</p>
        {errore && <Alert variant="danger">{errore}</Alert>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(hideDeleteOffertaModalAction())}>
          Annulla
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Elimina
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteOffertaModal;
