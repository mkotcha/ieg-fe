import axios from "axios";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { hideAddUtenteModalAction } from "../../redux/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { Ruolo, Utente } from "../../types";
import { erroreApi } from "../../utils/erroreApi";

interface FormUtente {
  username: string;
  nome: string;
  cognome: string;
  email: string;
  ruolo: Ruolo;
  password: string;
}

const nuovoUtente = (): FormUtente => ({
  username: "",
  nome: "",
  cognome: "",
  email: "",
  ruolo: "USER",
  password: "",
});

/**
 * Nuovo utente o modifica di uno esistente (dati e ruolo). In modifica la password si cambia solo se il campo è
 * compilato (reset da parte dell'ADMIN, senza la password attuale).
 */
const AddUtenteModal = () => {
  const showAddUtenteModal = useAppSelector(state => state.modal.showAddUtenteModal);
  const modUtenteId = useAppSelector(state => state.modal.modUtenteId);
  const token = useAppSelector(state => state.auth.token);
  const [utente, setUtente] = useState<FormUtente>(nuovoUtente);
  const [errore, setErrore] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setUtente(prevState => ({ ...prevState, [id]: value }));
  };

  const handlePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrore(null);
    const urlApi = `${import.meta.env.VITE_REACT_APP_API_URL}/utenti`;
    const headers = { Authorization: `Bearer ${token}` };
    const dati = {
      username: utente.username.trim(),
      nome: utente.nome.trim() || null,
      cognome: utente.cognome.trim() || null,
      email: utente.email.trim(),
      ruolo: utente.ruolo,
    };
    try {
      if (modUtenteId) {
        await axios.put(`${urlApi}/${modUtenteId}`, dati, { headers });
        if (utente.password) {
          await axios.put(`${urlApi}/${modUtenteId}/password`, { nuovaPassword: utente.password }, { headers });
        }
      } else {
        await axios.post(urlApi, { ...dati, password: utente.password }, { headers });
      }
      dispatch(hideAddUtenteModalAction());
    } catch (error) {
      setErrore(erroreApi(error, "Errore durante il salvataggio dell'utente"));
    }
  };

  useEffect(() => {
    const fetchUtente = async () => {
      const response = await axios.get<Utente>(`${import.meta.env.VITE_REACT_APP_API_URL}/utenti/${modUtenteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const u = response.data;
      setUtente({
        username: u.username,
        nome: u.nome ?? "",
        cognome: u.cognome ?? "",
        email: u.email ?? "",
        ruolo: u.ruolo,
        password: "",
      });
    };

    setErrore(null);
    if (modUtenteId) fetchUtente();
    else setUtente(nuovoUtente());
  }, [modUtenteId, showAddUtenteModal, token]);

  return (
    <Modal show={showAddUtenteModal} onHide={() => dispatch(hideAddUtenteModalAction())} aria-labelledby="add-utente-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="add-utente-modal-title">{modUtenteId ? "Modifica utente" : "Aggiungi utente"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePost} autoComplete="off">
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" required onChange={handleChange} value={utente.username} />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group controlId="nome" className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" onChange={handleChange} value={utente.nome} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="cognome" className="mb-3">
                <Form.Label>Cognome</Form.Label>
                <Form.Control type="text" onChange={handleChange} value={utente.cognome} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required onChange={handleChange} value={utente.email} />
          </Form.Group>
          <Form.Group controlId="ruolo" className="mb-3">
            <Form.Label>Ruolo</Form.Label>
            <Form.Select onChange={handleChange} value={utente.ruolo}>
              <option value="USER">USER - sola lettura</option>
              <option value="ADMIN">ADMIN - può modificare tutto</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>{modUtenteId ? "Nuova password" : "Password"}</Form.Label>
            <Form.Control
              type="password"
              required={!modUtenteId}
              minLength={8}
              autoComplete="new-password"
              onChange={handleChange}
              value={utente.password}
            />
            <Form.Text muted>
              almeno 8 caratteri{modUtenteId ? "; lascia vuoto per non cambiarla" : ""}
            </Form.Text>
          </Form.Group>
          {errore && <Alert variant="danger">{errore}</Alert>}
          <Button variant="primary" type="submit">
            {modUtenteId ? "Aggiorna" : "Aggiungi"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUtenteModal;
