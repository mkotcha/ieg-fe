import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import LetturaPod from "./cellComponents/LetturaPod";

const Letture = () => {
  const token = useSelector(state => state.auth.token);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [colDefs] = useState([
    { field: "fornitura.id", headerName: "test", cellRenderer: LetturaPod },
    { field: "fornitura.id", headerName: "POD", filter: true },
    { field: "dataLettura", headerName: "data" },
    { field: "tipoContatore", headerName: "Trattamento" },
    { field: "raccolta", headerName: "Raccolta" },
    { field: "tipoDato", headerName: "Tipo dato" },
    { field: "validato", headerName: "Validato" },
    { field: "potMax", headerName: "PotMax", type: "numericColumn" },
    { field: "eaF1", headerName: "EaF1", type: "numericColumn" },
    { field: "eaF2", headerName: "EaF2", type: "numericColumn" },
    { field: "eaF3", headerName: "EaF3", type: "numericColumn" },
    { field: "erF1", headerName: "ErF1", type: "numericColumn" },
    { field: "erF2", headerName: "ErF2", type: "numericColumn" },
    { field: "erF3", headerName: "ErF3", type: "numericColumn" },
    { field: "potF1", headerName: "PotF1", type: "numericColumn" },
    { field: "potF2", headerName: "PotF2", type: "numericColumn" },
    { field: "potF3", headerName: "PotF3", type: "numericColumn" },
    { field: "note", headerName: "Note" },
  ]);
  const autoSizeStrategy = {
    type: "fitCellContents",
  };

  const fetchLetture = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/letture?size=10000&sort=dataLettura,desc`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRowData(response.data.content);
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
            <AgGridReact
              autoSizeStrategy={autoSizeStrategy}
              suppressColumnVirtualisation={true}
              rowData={rowData}
              columnDefs={colDefs}
              autoHeight={true}
              pagination={true}
              enableCellTextSelection={true}
              ensureDomOrder={true}
            />
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
