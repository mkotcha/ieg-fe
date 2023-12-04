import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

const Clienti = () => {
  const token = useSelector(state => state.auth.token);
  const [showModal, setShowModal] = useState(false);

  const fetchClienti = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
  };

  useState(() => {
    fetchClienti();
  }, []);

  return (
    <>
      <Container fluid>
        <h1>Clienti</h1>
        <p>Qui ci saranno i clienti</p>
      </Container>
      <div id="add-clienti">
        <Button onClick={() => setShowModal(true)} variant="primary" className="rounded-pill ">
          <i className="bi bi-plus-lg"></i>
        </Button>
      </div>
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Aggiungi Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="ragioneSociale">
              <Form.Label>Ragione sociale</Form.Label>
              <Form.Control type="text" placeholder="" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pIva">
              <Form.Label>Partita IVA</Form.Label>
              <Form.Control type="text" placeholder="" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="cf">
              <Form.Label>Codice fiscale</Form.Label>
              <Form.Control type="text" placeholder="" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="indirizzo">
              <Form.Label>Indirizzo</Form.Label>
              <Form.Control type="text" placeholder="" />
            </Form.Group>

            <Row>
              <Form.Group as={Col} xs={3} className="mb-3" controlId="cap">
                <Form.Label>Cap</Form.Label>
                <Form.Control type="text" placeholder="" />
              </Form.Group>
              <Form.Group as={Col} xs={3} className="mb-3" controlId="provincia">
                <Form.Label>provincia</Form.Label>
                <Form.Control type="text" placeholder="" />
              </Form.Group>
              <Form.Group as={Col} className="mb-3" controlId="comune">
                <Form.Label>Comune</Form.Label>
                <Form.Control type="text" placeholder="" />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="">
              <Form.Label></Form.Label>
              <Form.Control type="text" placeholder="" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="">
              <Form.Label></Form.Label>
              <Form.Control type="text" placeholder="" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="">
              <Form.Label></Form.Label>
              <Form.Control type="text" placeholder="" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="">
              <Form.Label></Form.Label>
              <Form.Control type="text" placeholder="" />
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Clienti;
