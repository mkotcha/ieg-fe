import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridApi, GridReadyEvent, IFilter, ValueFormatterParams } from "ag-grid-community";
import axios from "axios";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import LetturaPod from "./cellComponents/LetturaPod";
import { showAddLetturaModalAction, showUploadModalAction } from "../redux/actions";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { Lettura, PagedResponse } from "../types";

const formatNumeroIt = (params: ValueFormatterParams<Lettura, number>) =>
  params.value !== null && params.value !== undefined ? params.value.toLocaleString("it-IT") : "";

const Letture = () => {
  const { pod } = useParams();
  const [gridApi, setGridApi] = useState<GridApi<Lettura> | null>(null);
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const showAddLetturaModal = useAppSelector(state => state.modal.showAddLetturaModal);
  const showDeleteLetturaModal = useAppSelector(state => state.modal.showDeleteLetturaModal);
  const dispatch = useAppDispatch();
  const [rowData, setRowData] = useState<Lettura[]>([]);
  const [localeIt] = useState({ thousandSeparator: ".", decimalSeparator: "," });
  const [colDefs] = useState<ColDef<Lettura>[]>([
    { field: "fornitura.id", headerName: "POD", cellRenderer: LetturaPod, filter: true },
    { field: "dataLettura", headerName: "data", filter: true },
    { field: "tipoContatore", headerName: "Trattamento", filter: true },
    { field: "raccolta", headerName: "Raccolta" },
    { field: "tipoDato", headerName: "Tipo dato" },
    { field: "validato", headerName: "Validato" },
    {
      field: "potMax",
      headerName: "PotMax",
      type: "numericColumn",
      valueFormatter: (params: ValueFormatterParams<Lettura, string>) => {
        // Converte la stringa in un numero
        const numberValue = parseFloat(params.value ?? "");

        // Verifica se la conversione è riuscita
        if (isNaN(numberValue)) {
          return params.value ?? ""; // Restituisce il valore originale se non è un numero
        }

        // Restituisce il numero formattato localmente
        return numberValue.toLocaleString("it-IT");
      },
    },
    {
      field: "eaF1",
      headerName: "EaF1",
      type: "numericColumn",
      valueFormatter: formatNumeroIt,
    },
    {
      field: "eaF2",
      headerName: "EaF2",
      type: "numericColumn",
      valueFormatter: formatNumeroIt,
    },
    {
      field: "eaF3",
      headerName: "EaF3",
      type: "numericColumn",
      valueFormatter: formatNumeroIt,
    },
    {
      field: "erF1",
      headerName: "ErF1",
      type: "numericColumn",
      valueFormatter: formatNumeroIt,
    },
    {
      field: "erF2",
      headerName: "ErF2",
      type: "numericColumn",
      valueFormatter: formatNumeroIt,
    },
    {
      field: "erF3",
      headerName: "ErF3",
      type: "numericColumn",
      valueFormatter: formatNumeroIt,
    },
    {
      field: "potF1",
      headerName: "PotF1",
      type: "numericColumn",
      valueFormatter: formatNumeroIt,
    },
    {
      field: "potF2",
      headerName: "PotF2",
      type: "numericColumn",
      valueFormatter: formatNumeroIt,
    },
    {
      field: "potF3",
      headerName: "PotF3",
      type: "numericColumn",
      valueFormatter: formatNumeroIt,
    },
    { field: "note", headerName: "Note" },
  ]);
  const autoSizeStrategy = {
    type: "fitCellContents",
  } as const;

  const onGridReady = (params: GridReadyEvent<Lettura>) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    if (gridApi) {
      const podFilterComponent = gridApi.getFilterInstance<IFilter>("fornitura.id");
      if (podFilterComponent) {
        podFilterComponent.setModel({
          type: "equals",
          filter: pod,
        });
        gridApi.onFilterChanged();
      }
    }
  }, [gridApi, pod]);

  useEffect(() => {
    const fetchLetture = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/letture?size=10000&sort=dataLettura,desc`;
      const response = await axios.get<PagedResponse<Lettura>>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRowData(response.data.content);
    };

    if (!showAddLetturaModal && !showDeleteLetturaModal) fetchLetture();
  }, [showAddLetturaModal, showDeleteLetturaModal, token]);

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
            <div>
              <h1>Letture</h1>
            </div>
            <div className="ms-auto ">
              <Button variant="primary" onClick={() => dispatch(showAddLetturaModalAction())} className="me-2">
                Aggiungi lettura
              </Button>
              <Button variant="primary" onClick={() => dispatch(showUploadModalAction())}>
                Carica flussi
              </Button>
            </div>
          </div>
          <div className="ag-theme-quartz-dark flex-grow-1">
            {/* The AG Grid component */}
            <AgGridReact
              onGridReady={onGridReady}
              autoSizeStrategy={autoSizeStrategy}
              suppressColumnVirtualisation={true}
              rowData={rowData}
              columnDefs={colDefs}
              localeText={localeIt}
              pagination={true}
              enableCellTextSelection={true}
              ensureDomOrder={true}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Letture;
