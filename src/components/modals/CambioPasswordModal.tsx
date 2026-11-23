import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useAppSelector } from "../../redux/hooks";
import { erroreApi } from "../../utils/erroreApi";

/** Cambio della propria password (tutti gli utenti, anche in sola lettura). */
const CambioPasswordModal = ({ show, onHide }: { show: boolean; onHide: () => void }) => {
  const token = useAppSelector(state => state.auth.token);
  const [passwordAttuale, setPasswordAttuale] = useState("");
  const [nuovaPassword, setNuovaPassword] = useState("");
  const [conferma, setConferma] = useState("");
  const [errore, setErrore] = useState<string | null>(null);
  const [fatto, setFatto] = useState(false);

  useEffect(() => {
    setPasswordAttuale("");
    setNuovaPassword("");
    setConferma("");
    setErrore(null);
    setFatto(false);
  }, [show]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrore(null);
    if (nuovaPassword !== conferma) {
      setErrore("Le due password non coincidono");
      return;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/utenti/me/password`,
        { passwordAttuale, nuovaPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFatto(true);
    } catch (error) {
      setErrore(erroreApi(error, "Errore durante il cambio della password"));
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cambia password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fatto ? (
          <Alert variant="success" className="mb-0">
            Password cambiata.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="passwordAttuale" className="mb-3">
              <Form.Label>Password attuale</Form.Label>
              <Form.Control
                type="password"
                required
                autoComplete="current-password"
                value={passwordAttuale}
                onChange={e => setPasswordAttuale(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="nuovaPassword" className="mb-3">
              <Form.Label>Nuova password</Form.Label>
              <Form.Control
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={nuovaPassword}
                onChange={e => setNuovaPassword(e.target.value)}
              />
              <Form.Text muted>almeno 8 caratteri</Form.Text>
            </Form.Group>
            <Form.Group controlId="confermaPassword" className="mb-3">
              <Form.Label>Ripeti la nuova password</Form.Label>
              <Form.Control
                type="password"
                required
                autoComplete="new-password"
                value={conferma}
                onChange={e => setConferma(e.target.value)}
              />
            </Form.Group>
            {errore && <Alert variant="danger">{errore}</Alert>}
            <Button variant="primary" type="submit">
              Cambia password
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CambioPasswordModal;
