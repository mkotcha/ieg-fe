import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { hideAddOffertaModalAction } from "../../redux/actions";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { Offerta } from "../../types";
import { erroreApi } from "../../utils/erroreApi";

type CampiNumerici = "f1" | "f2" | "f3" | "maggiorazione" | "spread" | "ocv" | "ocf";
const campiNumerici: CampiNumerici[] = ["f1", "f2", "f3", "maggiorazione", "spread", "ocv", "ocf"];

/** Stato del form: numeri e date come stringhe dei campi input ("" = non valorizzato). */
type FormOfferta = Record<"nome" | "codice" | "tipo" | "modalitaProgrammazione" | "descrizione" | "dataInizio" | "dataFine" | CampiNumerici, string> &
  Record<"pun" | "capacitaMaggiorazione" | "hasSpread", boolean>;

const offertaVuota: FormOfferta = {
  nome: "",
  codice: "",
  tipo: "PUN",
  f1: "",
  f2: "",
  f3: "",
  pun: true,
  capacitaMaggiorazione: false,
  maggiorazione: "",
  hasSpread: false,
  spread: "",
  ocv: "",
  modalitaProgrammazione: "OCV",
  ocf: "",
  descrizione: "",
  dataInizio: "",
  dataFine: "",
};

const AddOffertaModal = () => {
  const showAddOffertaModal = useAppSelector(state => state.modal.showAddOffertaModal);
  const modOffertaId = useAppSelector(state => state.modal.modOffertaId);
  const token = useAppSelector(state => state.auth.token);
  const [offerta, setOfferta] = useState<FormOfferta>(offertaVuota);
  const [errore, setErrore] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setOfferta(prevState => ({ ...prevState, [id]: value }));
  };

  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    setOfferta(prevState => ({ ...prevState, [id]: checked }));
  };

  const handlePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrore(null);
    // i campi vuoti vanno al backend come null, i numeri come number
    const body: Record<string, unknown> = { ...offerta };
    campiNumerici.forEach(campo => {
      body[campo] = offerta[campo] === "" ? null : parseFloat(offerta[campo]);
    });
    (["codice", "descrizione", "dataInizio", "dataFine"] as const).forEach(campo => {
      if (offerta[campo] === "") body[campo] = null;
    });
    const urlApi = `${import.meta.env.VITE_REACT_APP_API_URL}/offerte`;
    try {
      if (modOffertaId) {
        await axios.put(`${urlApi}/${modOffertaId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(urlApi, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      dispatch(hideAddOffertaModalAction());
    } catch (error) {
      setErrore(erroreApi(error, "Errore durante il salvataggio dell'offerta"));
    }
  };

  useEffect(() => {
    const fetchOfferta = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/offerte/${modOffertaId}`;
      const response = await axios.get<Offerta>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const o = response.data;
      const form: FormOfferta = {
        ...offertaVuota,
        nome: o.nome ?? "",
        codice: o.codice ?? "",
        tipo: o.tipo ?? "PUN",
        pun: o.pun,
        capacitaMaggiorazione: o.capacitaMaggiorazione,
        hasSpread: o.hasSpread,
        modalitaProgrammazione: o.modalitaProgrammazione ?? "OCV",
        descrizione: o.descrizione ?? "",
        dataInizio: o.dataInizio ?? "",
        dataFine: o.dataFine ?? "",
      };
      campiNumerici.forEach(campo => {
        form[campo] = o[campo] == null ? "" : String(o[campo]);
      });
      setOfferta(form);
    };

    setErrore(null);
    if (modOffertaId) fetchOfferta();
    else setOfferta(offertaVuota);
  }, [modOffertaId, showAddOffertaModal, token]);

  const numero = (campo: CampiNumerici, label: string, step = "any") => (
    <Form.Group controlId={campo} className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control type="number" step={step} onChange={handleChange} value={offerta[campo]} />
    </Form.Group>
  );

  return (
    <Modal
      size="lg"
      show={showAddOffertaModal}
      onHide={() => dispatch(hideAddOffertaModalAction())}
      aria-labelledby="add-offerta-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="add-offerta-modal-title">{modOffertaId ? "Modifica offerta" : "Aggiungi offerta"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePost}>
          <Row>
            <Col md={8}>
              <Form.Group controlId="nome" className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" required onChange={handleChange} value={offerta.nome} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="codice" className="mb-3">
                <Form.Label>Codice</Form.Label>
                <Form.Control type="text" onChange={handleChange} value={offerta.codice} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group controlId="tipo" className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Select onChange={handleChange} value={offerta.tipo}>
                  <option value="PUN">PUN</option>
                  <option value="FISSO">FISSO</option>
                  <option value="NEW">NEW</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <Form.Check
                type="switch"
                id="pun"
                label="Prezzo indicizzato al PUN"
                checked={offerta.pun}
                onChange={handleCheck}
              />
            </Col>
          </Row>
          <Row>
            <Col md={4}>{numero("f1", "Prezzo F1 (€/kWh)")}</Col>
            <Col md={4}>{numero("f2", "Prezzo F2 (€/kWh)")}</Col>
            <Col md={4}>{numero("f3", "Prezzo F3 (€/kWh)")}</Col>
          </Row>
          <Row>
            <Col md={4} className="d-flex align-items-center">
              <Form.Check
                type="switch"
                id="capacitaMaggiorazione"
                label="Maggiorazione capacità"
                checked={offerta.capacitaMaggiorazione}
                onChange={handleCheck}
              />
            </Col>
            <Col md={4}>{numero("maggiorazione", "Maggiorazione")}</Col>
          </Row>
          <Row>
            <Col md={4} className="d-flex align-items-center">
              <Form.Check
                type="switch"
                id="hasSpread"
                label="Spread attivo"
                checked={offerta.hasSpread}
                onChange={handleCheck}
              />
            </Col>
            <Col md={4}>{numero("spread", "Spread")}</Col>
          </Row>
          <Row>
            <Col md={4}>{numero("ocv", "OCV")}</Col>
            <Col md={4}>
              <Form.Group controlId="modalitaProgrammazione" className="mb-3">
                <Form.Label>Modalità OCV</Form.Label>
                <Form.Select onChange={handleChange} value={offerta.modalitaProgrammazione}>
                  <option value="OCV">OCV (€/kWh sul consumo con perdite)</option>
                  <option value="CLASSIC">CLASSIC (% sulla spesa energia)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>{numero("ocf", "OCF")}</Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="dataInizio" className="mb-3">
                <Form.Label>Data inizio</Form.Label>
                <Form.Control type="date" onChange={handleChange} value={offerta.dataInizio} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="dataFine" className="mb-3">
                <Form.Label>Data fine</Form.Label>
                <Form.Control type="date" onChange={handleChange} value={offerta.dataFine} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="descrizione" className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control as="textarea" rows={2} onChange={handleChange} value={offerta.descrizione} />
          </Form.Group>
          {errore && <Alert variant="danger">{errore}</Alert>}
          <Button variant="primary" type="submit">
            {modOffertaId ? "Aggiorna" : "Aggiungi"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddOffertaModal;
