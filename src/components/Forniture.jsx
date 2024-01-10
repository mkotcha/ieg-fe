import { Container } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FornituraPod from "./cellComponents/FornituraPod";

const Forniture = () => {
  const token = useSelector(state => state.auth.token);
  // const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [colDefs] = useState([
    {
      field: "id",
      headerName: "POD",
      cellRenderer: FornituraPod,
    },
    { field: "cliente.ragioneSociale", headerName: "Ragione sociale" },
    { field: "indirizzo" },
    { field: "comune" },
    { field: "provincia" },
    { field: "cap" },
    { field: "dataSwitch" },
  ]);

  const autoSizeStrategy = {
    type: "fitCellContents",
  };

  const fetchForniture = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture?size=50`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRowData(response.data.content);
  };

  useState(() => {
    fetchForniture();
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <Container fluid className="flex-grow-1">
        <div className="d-flex flex-column  h-100">
          <h1>Forniture</h1>
          <div className="ag-theme-quartz-dark flex-grow-1">
            {/* The AG Grid component */}
            <AgGridReact rowData={rowData} columnDefs={colDefs} autoSizeStrategy={autoSizeStrategy} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Forniture;
