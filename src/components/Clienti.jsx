import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { showAddClienteModalAction } from "../redux/actions";
import ClienteTipo from "./cellComponents/ClienteTipo";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Clienti = () => {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showAddClienteModal = useSelector(state => state.modal.showAddClienteModal);
  const showDeleteClienteModal = useSelector(state => state.modal.showDeleteClienteModal);

  const [rowData, setRowData] = useState([]);
  const [colDefs] = useState([
    {
      field: "ragioneSociale",
      headerName: "Ragione sociale",
      flex: 5,
      cellRenderer: ClienteTipo,
      filter: true,
    },
    { field: "pIva", flex: 2, filter: true },
    { field: "cf", flex: 2, filter: true },
    { field: "indirizzo", flex: 3 },
    { field: "cap", flex: 1 },
    { field: "provincia", flex: 1 },
    { field: "comune", flex: 2 },
    { field: "telefono", flex: 1 },
    { field: "email", flex: 1 },
  ]);

  const autoSizeStrategy = {
    type: "fitCellContents",
  };

  // useState(() => {
  //   fetchClienti();
  // }),
  //   [];

  useEffect(() => {
    const fetchClienti = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti?size=50`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRowData(response.data.content);
    };
    console.log("daje");
    if (!showAddClienteModal || !showDeleteClienteModal) {
      fetchClienti();
    }
  }, [showAddClienteModal, showDeleteClienteModal, token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <Container fluid className="flex-grow-1">
        <div className="d-flex flex-column  h-100">
          <div className="d-flex align-items-center">
            <h1>Clienti</h1>
            <Button variant="primary" onClick={() => dispatch(showAddClienteModalAction())} className=" ms-auto me-2">
              Aggiungi cliente
            </Button>
          </div>
          <div className="ag-theme-quartz-dark flex-grow-1">
            {/* The AG Grid component */}
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              autoSizeStrategy={autoSizeStrategy}
              enableCellTextSelection={true}
              autoHeight={true}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Clienti;
