import axios from "axios";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { hideAddClienteModalAction } from "../../redux/actions";
import { useEffect } from "react";
import { useState } from "react";

const AddClienteModal = () => {
  const showAddClienteModal = useSelector(state => state.modal.showAddClienteModal);
  const modClienteId = useSelector(state => state.modal.modClienteId);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [cliente, setCliente] = useState({
    id: "",
    ragioneSociale: "",
    piva: "",
    cf: "",
    indirizzo: "",
    cap: "",
    provincia: "",
    comune: "",
    telefono: "",
    email: "",
  });

  const handleChange = event => {
    const id = event.target.id;
    let value = event.target.value;
    setCliente(prevState => ({ ...prevState, [id]: value }));
  };

  const handlePost = async event => {
    event.preventDefault();
    const urlApi = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti`;
    if (modClienteId) {
      const url = urlApi + "/" + modClienteId;
      const response = await axios.put(url, cliente, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 200) {
        dispatch(hideAddClienteModalAction());
      }
    } else {
      const url = urlApi;
      const response = await axios.post(url, cliente, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 201) {
        dispatch(hideAddClienteModalAction());
      }
    }
  };

  const resetCliente = () => {
    setCliente({
      id: "",
      ragioneSociale: "",
      piva: "",
      cf: "",
      indirizzo: "",
      cap: "",
      provincia: "",
      comune: "",
      telefono: "",
      email: "",
    });
  };

  useEffect(() => {
    if (modClienteId) {
      const fetchCliente = async () => {
        const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti/${modClienteId}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setCliente({
          id: data.id || "",
          ragioneSociale: data.ragioneSociale || "",
          piva: data.piva || "",
          cf: data.cf || "",
          indirizzo: data.indirizzo || "",
          cap: data.cap || "",
          provincia: data.provincia || "",
          comune: data.comune || "",
          telefono: data.telefono || "",
          email: data.email || "",
        });
      };
      fetchCliente();
    }
  }, [modClienteId, token]);

  return (
    <>
      <Modal
        size="lg"
        show={showAddClienteModal}
        onHide={() => {
          dispatch(hideAddClienteModalAction());
          resetCliente();
        }}
        aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title>{modClienteId ? "Modifica cliente" : "Aggiungi Cliente"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePost}>
            <Form.Group className="mb-3" controlId="ragioneSociale">
              <Form.Label>Ragione sociale</Form.Label>
              <Form.Control type="text" value={cliente.ragioneSociale} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="piva">
              <Form.Label>Partita IVA</Form.Label>
              <Form.Control type="text" onChange={handleChange} value={cliente.piva} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="cf">
              <Form.Label>Codice fiscale</Form.Label>
              <Form.Control type="text" onChange={handleChange} value={cliente.cf} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="indirizzo">
              <Form.Label>Indirizzo</Form.Label>
              <Form.Control type="text" value={cliente.indirizzo} onChange={handleChange} />
            </Form.Group>

            <Row>
              <Form.Group as={Col} xs={3} className="mb-3" controlId="cap">
                <Form.Label>Cap</Form.Label>
                <Form.Control type="text" value={cliente.cap} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} xs={3} className="mb-3" controlId="provincia">
                <Form.Label>provincia</Form.Label>
                <Form.Control type="text" value={cliente.provincia} onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} className="mb-3" controlId="comune">
                <Form.Label>Comune</Form.Label>
                <Form.Control type="text" value={cliente.comune} onChange={handleChange} />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>Telefono</Form.Label>
              <Form.Control type="text" value={cliente.telefono} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>email</Form.Label>
              <Form.Control type="text" value={cliente.email} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              {modClienteId ? "Aggiorna" : "Aggiungi"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddClienteModal;
