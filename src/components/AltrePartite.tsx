import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showAddAltraPartitaModalAction } from "../redux/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import AltraPartitaPod from "./cellComponents/AltraPartitaPod";
import type { AltraPartita } from "../types";

const AltrePartite = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const showAddAltraPartitaModal = useAppSelector(state => state.modal.showAddAltraPartitaModal);
  const showDeleteAltraPartitaModal = useAppSelector(state => state.modal.showDeleteAltraPartitaModal);
  const [rowData, setRowData] = useState<AltraPartita[]>([]);
  const [colDefs] = useState<ColDef<AltraPartita>[]>([
    { field: "fornitura.id", headerName: "POD", filter: true, cellRenderer: AltraPartitaPod },
    { field: "fornitura.cliente.ragioneSociale", headerName: "Cliente", filter: true },
    { field: "mese", headerName: "Mese", type: "numericColumn", filter: true },
    { field: "anno", headerName: "Anno", type: "numericColumn", filter: true },
    { field: "voce", headerName: "Voce", filter: true },
    {
      field: "importo",
      headerName: "Importo",
      type: "numericColumn",
      valueFormatter: p =>
        p.value == null ? "" : p.value.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    {
      field: "esenteIva",
      headerName: "IVA",
      // esente: fuori dall'imponibile, solo nel totale da pagare; soggetta: paga l'iva della fornitura
      valueFormatter: p => (p.value ? "esente" : "soggetta"),
      filter: true,
    },
  ]);

  const autoSizeStrategy = {
    type: "fitCellContents",
  } as const;

  useEffect(() => {
    const fetchAltrePartite = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/altre-partite`;
      const response = await axios.get<AltraPartita[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRowData(response.data);
    };
    if (!showAddAltraPartitaModal && !showDeleteAltraPartitaModal) fetchAltrePartite();
  }, [showAddAltraPartitaModal, showDeleteAltraPartitaModal, token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Container fluid className="flex-grow-1">
      <div className="d-flex flex-column h-100">
        <div className="d-flex align-items-center">
          <h1>Altre partite</h1>
          <div className="ms-auto ">
            <Button variant="primary" onClick={() => dispatch(showAddAltraPartitaModalAction())}>
              Aggiungi partita
            </Button>
          </div>
        </div>
        <div className="ag-theme-quartz-dark flex-grow-1">
          <AgGridReact
            autoSizeStrategy={autoSizeStrategy}
            suppressColumnVirtualisation={true}
            rowData={rowData}
            columnDefs={colDefs}
            enableCellTextSelection={true}
            ensureDomOrder={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default AltrePartite;
