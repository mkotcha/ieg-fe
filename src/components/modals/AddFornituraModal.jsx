import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { hideAddFornituraModalAction } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const AddFornituraModal = () => {
  const showAddFornituraModal = useSelector(state => state.modal.showAddFornituraModal);
  const modFornituraId = useSelector(state => state.modal.modFornituraId);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [fornitura, setFornitura] = useState({
    id: "",
    bta: "",
    idCliente: "",
    codiceDistributore: "",
    comune: "",
    dataSwitch: "",
    dataSwitchOut: "",
    fatturazione: "",
    fornitore: "",
    indirizzo: "",
    iva: 0,
    potenzaDisponibile: 0,
    potenzaImpegnata: 0,
    íddPrezzo: "",
    idProgrammazione: "",
    provincia: "",
    tipoContatore: "",
    tipoPrelievo: "",
  });

  const handleChange = event => {
    const id = event.target.id;
    let value = event.target.value;
    setFornitura(prevState => ({ ...prevState, [id]: value }));
  };

  const handlePost = async event => {
    console.log(event);
  };

  const resetFornitura = () => {
    setFornitura({
      id: "",
      bta: "",
      idCliente: "",
      codiceDistributore: "",
      comune: "",
      dataSwitch: "",
      dataSwitchOut: "",
      fatturazione: "",
      fornitore: "",
      indirizzo: "",
      iva: 0,
      potenzaDisponibile: 0,
      potenzaImpegnata: 0,
      íddPrezzo: "",
      idProgrammazione: "",
      provincia: "",
      tipoContatore: "",
      tipoPrelievo: "",
    });
  };

  useEffect(() => {
    if (modFornituraId) {
      const fetchFornitura = async () => {
        const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture/${modFornituraId}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setFornitura({
          id: data.id || "",
          bta: data.bta || "",
          idCliente: data.idCliente || "",
          codiceDistributore: data.codiceDistributore || "",
          comune: data.comune || "",
          dataSwitch: data.dataSwitch || "",
          dataSwitchOut: data.dataSwitchOut || "",
          fatturazione: data.fatturazione || "",
          fornitore: data.fornitore || "",
          indirizzo: data.indirizzo || "",
          iva: data.iva || 0,
          potenzaDisponibile: data.potenzaDisponibile || 0,
          potenzaImpegnata: data.potenzaImpegnata || 0,
          íddPrezzo: data.íddPrezzo || "",
          idProgrammazione: data.idProgrammazione || "",
          provincia: data.provincia || "",
          tipoContatore: data.tipoContatore || "",
          tipoPrelievo: data.tipoContatore || "",
        });
      };
      fetchFornitura();
    }
  }, [modFornituraId, token]);

  return (
    <>
      dajeeeeeeeeeeeeeee
      <Modal
        size="lg"
        show={showAddFornituraModal}
        onHide={() => {
          dispatch(hideAddFornituraModalAction());
          resetFornitura();
        }}
        aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title>{modFornituraId ? "Modifica fornitura" : "Aggiungi Fornitura"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePost}>
            <Form.Group className="mb-3" controlId="ragioneSociale">
              <Form.Label>Ragione sociale</Form.Label>
              <Form.Control type="text" value={fornitura.ragioneSociale} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pIva">
              <Form.Label>Partita IVA</Form.Label>
              <Form.Control type="text" onChange={handleChange} value={fornitura.pIva} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="cf">
              <Form.Label>Codice fiscale</Form.Label>
              <Form.Control type="text" onChange={handleChange} value={fornitura.cf} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="indirizzo">
              <Form.Label>Indirizzo</Form.Label>
              <Form.Control type="text" value={fornitura.indirizzo} onChange={handleChange} />
            </Form.Group>

            <Row>
              <Form.Group as={Col} xs={3} className="mb-3" controlId="cap">
                <Form.Label>Cap</Form.Label>
                <Form.Control type="text" value={fornitura.cap} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} xs={3} className="mb-3" controlId="provincia">
                <Form.Label>provincia</Form.Label>
                <Form.Control type="text" value={fornitura.provincia} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} className="mb-3" controlId="comune">
                <Form.Label>Comune</Form.Label>
                <Form.Control type="text" value={fornitura.comune} onChange={handleChange} />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>Telefono</Form.Label>
              <Form.Control type="text" value={fornitura.telefono} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>email</Form.Label>
              <Form.Control type="text" value={fornitura.email} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              {modFornituraId ? "Aggiorna" : "Aggiungi"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddFornituraModal;
