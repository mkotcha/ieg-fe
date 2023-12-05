import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

const Letture = () => {
  const token = useSelector(state => state.auth.token);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [colDefs] = useState([
    { field: "fornitura.pod", headerName: "POD", flex: 4 },
    { field: "dataLettura", headerName: "data", flex: 3 },
  ]);

  const fetchLetture = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/letture?size=50`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRowData(response.data.content);
    console.log(response.data.content);
  };

  const handleUpload = async () => {
    setShowModal(true);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const file = event.target.elements.namedItem("flussi").files[0];
    formData.append("flussi", file);
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/letture/flussi`;
    const response = await axios.post(url, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    setShowModal(false);
  };

  useState(() => {
    fetchLetture();
  }, []);

  return (
    <>
      <Container fluid className="flex-grow-1">
        <div className="d-flex flex-column  h-100">
          <div className="d-flex align-items-center">
            <div>
              <h1>Letture</h1>
            </div>
            <div className="ms-auto">
              <Button variant="primary" onClick={handleUpload}>
                Carica flussi
              </Button>
            </div>
          </div>
          <div className="ag-theme-quartz-dark flex-grow-1">
            {/* The AG Grid component */}
            <AgGridReact rowData={rowData} columnDefs={colDefs} autoHeight={true} />
          </div>
        </div>
      </Container>
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Carica flussi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="flussi" className="mb-3">
              <Form.Label>Carica i flussi in formato .zip</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Carica
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Letture;
