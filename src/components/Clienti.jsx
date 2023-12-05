import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

const Clienti = () => {
  const token = useSelector(state => state.auth.token);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    { field: "ragioneSociale", flex: 4 },
    { field: "piva", flex: 2 },
    { field: "cf", flex: 2 },
    { field: "indirizzo", flex: 3 },
    { field: "cap", flex: 1 },
    { field: "provincia", flex: 1 },
    { field: "comune", flex: 2 },
    { field: "telefono", flex: 1 },
    { field: "email", flex: 1 },
  ]);

  const fetchClienti = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti?size=50`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRowData(response.data.content);
    console.log(response.data.content);
  };

  useState(() => {
    fetchClienti();
  }, []);

  return (
    <>
      <Container fluid className="h-100 content">
        <h1>Clienti</h1>
        <div className="ag-theme-quartz-dark" style={{ height: 750 }}>
          {/* The AG Grid component */}
          <AgGridReact rowData={rowData} rowHeight={32} columnDefs={colDefs} />
        </div>
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
