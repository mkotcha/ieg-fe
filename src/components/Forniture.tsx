import { Button, Container } from "react-bootstrap";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import axios from "axios";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FornituraPod from "./cellComponents/FornituraPod";
import FornituraOfferta from "./cellComponents/FornituraOfferta";
import { formatEuro, formatNumero } from "../utils/formato";
import { showAddFornituraModalAction } from "../redux/actions";
import { useAppDispatch, useAppSelector, useIsAdmin } from "../redux/hooks";
import type { Fornitura, PagedResponse } from "../types";

const formatData = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString("it-IT") : "");

const Forniture = () => {
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAdmin = useIsAdmin();
  const showAddFornituraModal = useAppSelector(state => state.modal.showAddFornituraModal);
  const showDeleteFornituraModal = useAppSelector(state => state.modal.showDeleteFornituraModal);
  const showAddOffertaModal = useAppSelector(state => state.modal.showAddOffertaModal);
  const cambioOfferta = useAppSelector(state => state.modal.cambiaOffertaPod !== null);
  const [rowData, setRowData] = useState<Fornitura[]>([]);
  const [colDefs] = useState<ColDef<Fornitura>[]>([
    {
      field: "id",
      headerName: "POD",
      cellRenderer: FornituraPod,
      filter: true,
    },
    {
      field: "cliente.ragioneSociale",
      headerName: "Ragione sociale",
      filter: true,
      cellRenderer: (p: ICellRendererParams<Fornitura, string>) => (
        <Link to={`/cliente/${p.data?.cliente?.id}`} className="text-decoration-none text-reset">{p.value}</Link>
      ),
    },
    { field: "indirizzo", headerName: "Indirizzo", filter: true },
    { field: "comune", headerName: "Comune", filter: true },
    { field: "provincia", headerName: "Provincia", filter: true },
    { field: "cap", headerName: "CAP" },
    { field: "bta", headerName: "BTA", filter: true },
    { field: "tipoPrelievo", headerName: "Prelievo", filter: true },
    { field: "tipoContatore", headerName: "Contatore", filter: true },
    { field: "codiceDistributore", headerName: "Distributore", filter: true },
    {
      field: "potenzaImpegnata",
      headerName: "Potenza impegnata kW",
      type: "numericColumn",
      valueFormatter: p => formatNumero(p.value),
    },
    {
      field: "potenzaDisponibile",
      headerName: "Potenza disponibile kW",
      type: "numericColumn",
      valueFormatter: p => formatNumero(p.value),
    },
    { field: "offerta.nome", headerName: "Offerta", filter: true, cellRenderer: FornituraOfferta },
    { field: "fatturazione", headerName: "Fatturazione", filter: true },
    { field: "iva", headerName: "IVA %", type: "numericColumn", valueFormatter: p => formatNumero(p.value) },
    {
      field: "rettificaProgrammazione",
      headerName: "Rettifica €/mese",
      type: "numericColumn",
      valueFormatter: p => formatEuro(p.value),
    },
    { field: "fornitore", headerName: "Fornitore", filter: true },
    { field: "dataSwitch", headerName: "Data switch", filter: true, valueFormatter: p => formatData(p.value) },
    { field: "dataSwitchOut", headerName: "Data switch out", filter: true, valueFormatter: p => formatData(p.value) },
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

    // ricaricate anche alla chiusura della modifica o del cambio offerta (pulsanti nella colonna Offerta)
    if (!showAddFornituraModal && !showDeleteFornituraModal && !showAddOffertaModal && !cambioOfferta) {
      fetchForniture();
    }
  }, [showAddFornituraModal, showDeleteFornituraModal, showAddOffertaModal, cambioOfferta, token]);

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
            {isAdmin && (
              <Button variant="primary" onClick={() => dispatch(showAddFornituraModalAction())} className=" ms-auto me-2">
                Aggiungi Fornitura
              </Button>
            )}
          </div>
          <div className="ag-theme-quartz-dark flex-grow-1">
            {/* The AG Grid component */}
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              autoSizeStrategy={autoSizeStrategy}
              enableCellTextSelection={true}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Forniture;
