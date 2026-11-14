import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { hideAddAltraPartitaModalAction } from "../../redux/actions";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { AltraPartita, Fornitura, PagedResponse } from "../../types";
import { erroreApi } from "../../utils/erroreApi";

interface FormAltraPartita {
  pod: string;
  voce: string;
  importo: string;
  esenteIva: boolean;
  mese: string;
  anno: string;
}

const nuovaPartita = (): FormAltraPartita => ({
  pod: "",
  voce: "",
  importo: "",
  esenteIva: true,
  mese: String(new Date().getMonth() + 1),
  anno: String(new Date().getFullYear()),
});

const mesi = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const AddAltraPartitaModal = () => {
  const showAddAltraPartitaModal = useAppSelector(state => state.modal.showAddAltraPartitaModal);
  const modAltraPartitaId = useAppSelector(state => state.modal.modAltraPartitaId);
  const token = useAppSelector(state => state.auth.token);
  const [partita, setPartita] = useState<FormAltraPartita>(nuovaPartita);
  const [forniture, setForniture] = useState<Fornitura[]>([]);
  const [errore, setErrore] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setPartita(prevState => ({ ...prevState, [id]: value }));
  };

  const handlePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrore(null);
    const body = {
      pod: partita.pod.trim(),
      voce: partita.voce,
      importo: parseFloat(partita.importo),
      esenteIva: partita.esenteIva,
      mese: parseInt(partita.mese, 10),
      anno: parseInt(partita.anno, 10),
    };
    const urlApi = `${import.meta.env.VITE_REACT_APP_API_URL}/altre-partite`;
    try {
      if (modAltraPartitaId) {
        await axios.put(`${urlApi}/${modAltraPartitaId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(urlApi, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      dispatch(hideAddAltraPartitaModalAction());
    } catch (error) {
      setErrore(erroreApi(error, "Errore durante il salvataggio della partita"));
    }
  };

  // elenco dei POD per l'autocompletamento
  useEffect(() => {
    const fetchForniture = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture?size=1000`;
      const response = await axios.get<PagedResponse<Fornitura>>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForniture(response.data.content);
    };
    if (showAddAltraPartitaModal && token) fetchForniture();
  }, [showAddAltraPartitaModal, token]);

  useEffect(() => {
    const fetchPartita = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/altre-partite/${modAltraPartitaId}`;
      const response = await axios.get<AltraPartita>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const p = response.data;
      setPartita({
        pod: p.fornitura?.id ?? "",
        voce: p.voce ?? "",
        importo: p.importo == null ? "" : String(p.importo),
        esenteIva: p.esenteIva,
        mese: String(p.mese),
        anno: String(p.anno),
      });
    };

    setErrore(null);
    if (modAltraPartitaId) fetchPartita();
    else setPartita(nuovaPartita());
  }, [modAltraPartitaId, showAddAltraPartitaModal, token]);

  return (
    <Modal
      size="lg"
      show={showAddAltraPartitaModal}
      onHide={() => dispatch(hideAddAltraPartitaModalAction())}
      aria-labelledby="add-altra-partita-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="add-altra-partita-modal-title">
          {modAltraPartitaId ? "Modifica partita" : "Aggiungi partita"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePost}>
          <Form.Group controlId="pod" className="mb-3">
            <Form.Label>POD</Form.Label>
            <Form.Control
              type="text"
              required
              list="altra-partita-pod-list"
              className="font-monospace"
              onChange={handleChange}
              value={partita.pod}
            />
            <datalist id="altra-partita-pod-list">
              {forniture.map(f => (
                <option key={f.id} value={f.id}>
                  {f.cliente?.ragioneSociale}
                </option>
              ))}
            </datalist>
          </Form.Group>
          <Form.Group controlId="voce" className="mb-3">
            <Form.Label>Voce</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="es. corrispettivo morosità, pratica aumento di potenza"
              onChange={handleChange}
              value={partita.voce}
            />
          </Form.Group>
          <Row>
            <Col md={4}>
              <Form.Group controlId="importo" className="mb-3">
                <Form.Label>Importo (€)</Form.Label>
                <Form.Control type="number" step="0.01" required onChange={handleChange} value={partita.importo} />
                <Form.Text muted>negativo per un accredito</Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="mese" className="mb-3">
                <Form.Label>Mese</Form.Label>
                <Form.Select onChange={handleChange} value={partita.mese}>
                  {mesi.map((nome, i) => (
                    <option key={nome} value={i + 1}>
                      {nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="anno" className="mb-3">
                <Form.Label>Anno</Form.Label>
                <Form.Control type="number" min={2000} required onChange={handleChange} value={partita.anno} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="esenteIva"
              label="Esente IVA"
              checked={partita.esenteIva}
              onChange={e => setPartita(prevState => ({ ...prevState, esenteIva: e.target.checked }))}
            />
            <Form.Text muted>
              {partita.esenteIva
                ? "Importo già comprensivo di IVA o fuori campo: resta fuori dall'imponibile e si somma solo al totale da pagare."
                : "Importo imponibile: entra nell'imponibile e paga l'IVA della fornitura."}
            </Form.Text>
          </Form.Group>
          {errore && <Alert variant="danger">{errore}</Alert>}
          <Button variant="primary" type="submit">
            {modAltraPartitaId ? "Aggiorna" : "Aggiungi"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAltraPartitaModal;
