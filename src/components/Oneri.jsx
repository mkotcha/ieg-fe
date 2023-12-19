import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showAddDipacciamentoModalAction, showAddOneriModalAction } from "../redux/actions";
import { useEffect } from "react";
import axios from "axios";

const Oneri = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const showAddOneriModal = useSelector(state => state.modal.showAddOneriModal);
  const showDeleteOneriModal = useSelector(state => state.modal.showDeleteOneriModal);
  const showDispacciamentoModal = useSelector(state => state.modal.showAddDipacciamentoModal);
  const showDeleteDispacciamentoModal = useSelector(state => state.modal.showDeleteDipacciamentoModal);
  const [oneriRowData, setOneriRowData] = useState([]);
  const [oneriColDefs] = useState([
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
  const [dispacciamentoRowData, setDispacciamentoRowData] = useState([]);
  const [dispacciamentoColDefs] = useState([{ field: "dataLettura", headerName: "data" }]);

  useEffect(() => {
    const fetchOneri = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/oneri`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOneriRowData(response.data.content);
    };
    const fetchDispacciamento = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/dispacciamento`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDispacciamentoRowData(response.data.content);
    };

    if (!showAddOneriModal || !showDeleteOneriModal) fetchOneri();
    if (!showDispacciamentoModal || !showDeleteDispacciamentoModal) fetchDispacciamento();
  }, [showAddOneriModal, showDeleteDispacciamentoModal, showDeleteOneriModal, showDispacciamentoModal, token]);

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
            <Button variant="primary" onClick={() => dispatch(showAddDipacciamentoModalAction())} className="me-2">
              Aggiungi dispacciamento
            </Button>
          </div>
        </div>
        <div className="ag-theme-quartz-dark flex-grow-1">
          {/* The AG Grid component */}
          <AgGridReact
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
