import { Container } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

const Forniture = () => {
  const token = useSelector(state => state.auth.token);
  // const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [colDefs] = useState([
    { field: "id", headerName: "POD", flex: 3 },
    { field: "cliente.ragioneSociale", headerName: "Ragione sociale", flex: 4 },
    { field: "indirizzo", flex: 2 },
    { field: "comune", flex: 3 },
    { field: "provincia", flex: 1 },
    { field: "cap", flex: 1 },
    { field: "dataSwitch", flex: 2 },
  ]);

  const fetchForniture = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture?size=50`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRowData(response.data.content);
    console.log(response.data.content);
  };

  useState(() => {
    fetchForniture();
  }, []);

  return (
    <>
      <Container fluid className="flex-grow-1">
        <div className="d-flex flex-column  h-100">
          <h1>Forniture</h1>
          <div className="ag-theme-quartz-dark flex-grow-1">
            {/* The AG Grid component */}
            <AgGridReact rowData={rowData} columnDefs={colDefs} autoHeight={true} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Forniture;
