import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { hideCambiaOffertaModalAction, showNuovaOffertaFornituraModalAction } from "../../redux/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { Fornitura, Offerta } from "../../types";
import { erroreApi } from "../../utils/erroreApi";
import { formatNumero } from "../../utils/formato";

/**
 * Associa alla fornitura un'altra offerta esistente (PUT /forniture/{pod}/offerta), oppure passa alla creazione di
 * una nuova offerta che viene associata alla fornitura appena salvata.
 */
const CambiaOffertaModal = () => {
  const pod = useAppSelector(state => state.modal.cambiaOffertaPod);
  const token = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();
  const [fornitura, setFornitura] = useState<Fornitura | null>(null);
  const [offerte, setOfferte] = useState<Offerta[] | null>(null);
  const [scelta, setScelta] = useState("");
  const [errore, setErrore] = useState<string | null>(null);
  const [salvataggio, setSalvataggio] = useState(false);
  const api = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    if (!pod) return;
    setErrore(null);
    setFornitura(null);
    setOfferte(null);
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get<Fornitura>(`${api}/forniture/${pod}`, { headers }),
      axios.get<Offerta[]>(`${api}/offerte`, { headers }),
    ])
      .then(([f, o]) => {
        setFornitura(f.data);
        setScelta(f.data.offerta ? String(f.data.offerta.id) : "");
        setOfferte([...o.data].sort((a, b) => a.nome.localeCompare(b.nome)));
      })
      .catch(error => setErrore(erroreApi(error, "Errore nel caricamento delle offerte")));
  }, [api, pod, token]);

  const chiudi = () => dispatch(hideCambiaOffertaModalAction());

  const associa = async () => {
    if (!pod || !scelta) return;
    setSalvataggio(true);
    setErrore(null);
    try {
      await axios.put(`${api}/forniture/${pod}/offerta?offertaId=${scelta}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      chiudi();
    } catch (error) {
      setErrore(erroreApi(error, "Errore nel cambio dell'offerta"));
    } finally {
      setSalvataggio(false);
    }
  };

  const nuovaOfferta = () => {
    if (!pod) return;
    chiudi();
    dispatch(showNuovaOffertaFornituraModalAction(pod));
  };

  const attuale = fornitura?.offerta ? String(fornitura.offerta.id) : "";

  return (
    <Modal show={pod !== null} onHide={chiudi} aria-labelledby="cambia-offerta-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="cambia-offerta-modal-title">Cambia offerta - {pod}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fornitura && (
          <div className="mb-2 small">
            {fornitura.cliente?.ragioneSociale} · offerta attuale:{" "}
            {fornitura.offerta ? (
              <strong>{fornitura.offerta.nome}</strong>
            ) : (
              <span className="text-warning">nessuna</span>
            )}
          </div>
        )}
        {!offerte && !errore && <Spinner animation="border" size="sm" />}
        {offerte && (
          <Form.Group controlId="cambia-offerta-scelta">
            <Form.Label>Nuova offerta</Form.Label>
            <Form.Select value={scelta} onChange={e => setScelta(e.target.value)}>
              <option value="">scegli un&apos;offerta...</option>
              {offerte.map(o => (
                <option key={o.id} value={o.id}>
                  {o.nome}
                  {o.codice ? ` (${o.codice})` : ""}
                  {o.pun ? " - PUN" : o.f1 != null ? ` - ${formatNumero(o.f1, 6)} €/kWh` : ""}
                </option>
              ))}
            </Form.Select>
            <Form.Text>
              Vale per le fatture calcolate da ora in poi: quelle già emesse non cambiano finché non vengono rigenerate.
            </Form.Text>
          </Form.Group>
        )}
        {errore && (
          <Alert variant="danger" className="py-2 mt-2 mb-0">
            {errore}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" className="me-auto" onClick={nuovaOfferta}>
          <i className="bi bi-plus-lg me-1"></i>nuova offerta
        </Button>
        <Button variant="secondary" onClick={chiudi}>
          Annulla
        </Button>
        <Button variant="primary" disabled={!scelta || scelta === attuale || salvataggio} onClick={associa}>
          Associa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CambiaOffertaModal;
