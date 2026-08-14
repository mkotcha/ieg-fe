import { Button, Container } from "react-bootstrap";
import type { ColDef } from "ag-grid-community";
import axios from "axios";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FornituraPod from "./cellComponents/FornituraPod";
import { showAddFornituraModalAction } from "../redux/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { Fornitura, PagedResponse } from "../types";

const Forniture = () => {
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const showAddFornituraModal = useAppSelector(state => state.modal.showAddFornituraModal);
  const showDeleteFornituraModal = useAppSelector(state => state.modal.showDeleteFornituraModal);
  const [rowData, setRowData] = useState<Fornitura[]>([]);
  const [colDefs] = useState<ColDef<Fornitura>[]>([
    {
      field: "id",
      headerName: "POD",
      cellRenderer: FornituraPod,
      filter: true,
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
  } as const;

  useEffect(() => {
    const fetchForniture = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture?size=10000`;
      const response = await axios.get<PagedResponse<Fornitura>>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRowData(response.data.content);
    };

    if (!showAddFornituraModal && !showDeleteFornituraModal) {
      fetchForniture();
    }
  }, [showAddFornituraModal, showDeleteFornituraModal, token]);

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
            <h1>Forniture</h1>
            <Button variant="primary" onClick={() => dispatch(showAddFornituraModalAction())} className=" ms-auto me-2">
              Aggiungi Fornitura
            </Button>
          </div>
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
