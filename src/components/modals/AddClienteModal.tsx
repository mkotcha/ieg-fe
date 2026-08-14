import axios from "axios";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { hideAddClienteModalAction } from "../../redux/actions";
import { useEffect, type ChangeEvent, type FormEvent } from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { Cliente } from "../../types";

const AddClienteModal = () => {
  const showAddClienteModal = useAppSelector(state => state.modal.showAddClienteModal);
  const modClienteId = useAppSelector(state => state.modal.modClienteId);
  const token = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();
  const [cliente, setCliente] = useState<Record<string, string | number>>({
    id: "",
    ragioneSociale: "",
    pIva: "",
    cf: "",
    indirizzo: "",
    cap: "",
    provincia: "",
    comune: "",
    telefono: "",
    email: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    const value = event.target.value;
    setCliente(prevState => ({ ...prevState, [id]: value }));
  };

  const handlePost = async (event: FormEvent<HTMLFormElement>) => {
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
      pIva: "",
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
        const response = await axios.get<Cliente>(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setCliente({
          id: data.id || "",
          ragioneSociale: data.ragioneSociale || "",
          pIva: data.pIva || "",
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
            <Form.Group className="mb-3" controlId="pIva">
              <Form.Label>Partita IVA</Form.Label>
              <Form.Control type="text" onChange={handleChange} value={cliente.pIva} />
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
