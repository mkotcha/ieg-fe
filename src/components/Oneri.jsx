import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showAddDispacciamentoModalAction, showAddOneriModalAction } from "../redux/actions";
import { useEffect } from "react";
import axios from "axios";
import OneriTipo from "./cellComponents/OneriTipo";
import DispacciamentoMod from "./cellComponents/DispacciamentoMod";
import { useNavigate } from "react-router-dom";

const Oneri = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();
  const showAddOneriModal = useSelector(state => state.modal.showAddOneriModal);
  const showDeleteOneriModal = useSelector(state => state.modal.showDeleteOneriModal);
  const showAddDispacciamentoModal = useSelector(state => state.modal.showAddDispacciamentoModal);
  const showDeleteDispacciamentoModal = useSelector(state => state.modal.showDeleteDispacciamentoModal);
  const [oneriRowData, setOneriRowData] = useState([]);
  const [oneriColDefs] = useState([
    { field: "tipo", headerName: "Tipo", filter: true, cellRenderer: OneriTipo },
    { field: "trimestre", headerName: "Trimestre", type: "numericColumn", filter: true },
    { field: "anno", headerName: "Anno", type: "numericColumn", filter: true },
    { field: "qeTud", headerName: "qeTud", type: "numericColumn" },
    { field: "qpTdm", headerName: "qpTdm", type: "numericColumn" },
    { field: "qfTud", headerName: "qfTud", type: "numericColumn" },
    { field: "qfMis", headerName: "qfMis", type: "numericColumn" },
    { field: "qeArim", headerName: "qeArim", type: "numericColumn" },
    { field: "qeAsos", headerName: "qeAsos", type: "numericColumn" },
    { field: "qeUc3", headerName: "qeUc3", type: "numericColumn" },
    { field: "qpArim", headerName: "qpArim", type: "numericColumn" },
    { field: "qpAsos", headerName: "qpAsos", type: "numericColumn" },
    { field: "qpOds", headerName: "qpOds", type: "numericColumn" },
    { field: "qfArim", headerName: "qfArim", type: "numericColumn" },
    { field: "qfArim", headerName: "qfArim", type: "numericColumn" },
  ]);
  const [dispacciamentoRowData, setDispacciamentoRowData] = useState([]);
  const [dispacciamentoColDefs] = useState([
    { cellRenderer: DispacciamentoMod },
    { field: "trimestre", headerName: "Trimestre", type: "numericColumn", filter: true },
    { field: "anno", headerName: "Anno", type: "numericColumn", filter: true },
    { field: "capacita", headerName: "Capacità", type: "numericColumn" },
    { field: "eolico", headerName: "Eolico", type: "numericColumn" },
    { field: "costoAm", headerName: "CostoAm", type: "numericColumn" },
    { field: "dis", headerName: "DIS", type: "numericColumn" },
    { field: "int73", headerName: "Int73", type: "numericColumn" },
    { field: "msd", headerName: "MSD", type: "numericColumn" },
    { field: "sicurezza", headerName: "Sicurezza", type: "numericColumn" },
    { field: "trasmissione", headerName: "Trasmissione", type: "numericColumn" },
  ]);

  const autoSizeStrategy = {
    type: "fitCellContents",
  };

  useEffect(() => {
    const fetchOneri = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/oneri`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOneriRowData(response.data);
    };

    if (!showAddOneriModal && !showDeleteOneriModal) fetchOneri();
  }, [showAddOneriModal, showDeleteOneriModal, token]);

  useEffect(() => {
    const fetchDispacciamento = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/dispacciamento`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDispacciamentoRowData(response.data);
    };
    if (!showAddDispacciamentoModal && !showDeleteDispacciamentoModal) fetchDispacciamento();
  }, [showDeleteDispacciamentoModal, showAddDispacciamentoModal, token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Container fluid className="flex-grow-1">
      <div className="d-flex flex-column h-100">
        <div className="d-flex align-items-center">
          <h1>Oneri</h1>
          <div className="ms-auto ">
            <Button variant="primary" onClick={() => dispatch(showAddOneriModalAction())}>
              Aggiungi oneri
            </Button>
          </div>
        </div>
        <div className="ag-theme-quartz-dark flex-grow-1">
          {/* The AG Grid component */}
          <AgGridReact
            autoSizeStrategy={autoSizeStrategy}
            suppressColumnVirtualisation={true}
            rowData={oneriRowData}
            columnDefs={oneriColDefs}
            autoHeight={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
          />
        </div>

        <div className="d-flex align-items-center mt-1">
          <h1>Dispacciamento</h1>
          <div className="ms-auto ">
            <Button variant="primary" onClick={() => dispatch(showAddDispacciamentoModalAction())} className="me-2">
              Aggiungi dispacciamento
            </Button>
          </div>
        </div>
        <div className="ag-theme-quartz-dark flex-grow-1">
          {/* The AG Grid component */}
          <AgGridReact
            autoSizeStrategy={autoSizeStrategy}
            suppressColumnVirtualisation={true}
            rowData={dispacciamentoRowData}
            columnDefs={dispacciamentoColDefs}
            autoHeight={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default Oneri;
