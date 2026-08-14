import { AgGridReact } from "ag-grid-react";
import type { ColDef, ValueFormatterParams } from "ag-grid-community";
import axios from "axios";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import FatturaNumero from "./cellComponents/FatturaNumero";
import { useNavigate } from "react-router-dom";
import ClienteTipo from "./cellComponents/ClienteTipo";
import FornituraPod from "./cellComponents/FornituraPod";
import { useAppSelector } from "../redux/hooks";
import type { Cliente as ClienteType, Fattura, Fornitura } from "../types";

const Cliente = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState<Partial<ClienteType>>({});
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();
  const currentMonth = new Date().getMonth();
  const [mese, setMese] = useState<number | string>(currentMonth === 0 ? 12 : currentMonth);
  const [anno, setAnno] = useState<number | string>(
    currentMonth === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear()
  );
  const [rowDataForniture, setRowDataForniture] = useState<Fornitura[]>([]);
  const [colDefsForniture] = useState<ColDef<Fornitura>[]>([
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
    { field: "potenzaDisponibile" },
    { field: "potenzaImpegnata" },
    { field: "tipoPrelievo" },
    { field: "tipoContatore" },
    { field: "codiceDistributore" },
  ]);
  const [rowDataCliente, setRowDataCliente] = useState<ClienteType[]>([]);
  const [colDefsCliente] = useState<ColDef<ClienteType>[]>([
    {
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
  const [rowDataFatture, setRowDataFatture] = useState<Fattura[]>([]);
  const formatImporto = (params: ValueFormatterParams<Fattura, string>) => {
    const number = parseFloat(params.value ?? "");
    return isNaN(number) ? "" : number.toFixed(2);
  };
  const [colDefsFatture] = useState<ColDef<Fattura>[]>([
    {
      field: "numeroFattura",
      headerName: "Numero fattura",
      cellRenderer: FatturaNumero,
      filter: true,
    },
    {
      field: "dataFattura",
      headerName: "Data emissione",
      filter: true,
    },
    {
      field: "totaleImponibile",
      headerName: "Imponibile",
      valueFormatter: formatImporto,
      type: "rightAligned",
    },
    {
      field: "consumoTot",
      headerName: "Consumo totale",
      valueFormatter: formatImporto,
      type: "rightAligned",
    },
    {
      field: "totaleImposte",
      headerName: "Totale Imposte",
      valueFormatter: formatImporto,
      type: "rightAligned",
    },
    {
      field: "totaleMateria",
      headerName: "Totale Materia",
      valueFormatter: formatImporto,
      type: "rightAligned",
    },
    {
      field: "totaleTrasporto",
      headerName: "Totale Trasporto",
      valueFormatter: formatImporto,
      type: "rightAligned",
    },
    {
      field: "totaleOneri",
      headerName: "Totale Oneri",
      valueFormatter: formatImporto,
      type: "rightAligned",
    },
    {
      field: "totaleIva",
      headerName: "Totale Iva",
      valueFormatter: formatImporto,
      type: "rightAligned",
    },
    {
      field: "consumoTotP",
      headerName: "Perdite Totali",
      valueFormatter: formatImporto,
      type: "rightAligned",
    },
  ]);

  const autoSizeStrategy = {
    type: "fitCellContents",
  } as const;

  const fetchFatture = useCallback(async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti/${id}/fatture`;
    const response = await axios.get<Fattura[]>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRowDataFatture(response.data);
  }, [id, token]);

  useEffect(() => {
    const fetchCliente = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti/${id}`;
      const response = await axios.get<ClienteType>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCliente(response.data);
      setRowDataCliente([response.data]);
    };
    const fetchForniture = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti/${id}/forniture`;
      const response = await axios.get<Fornitura[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRowDataForniture(response.data);
    };

    fetchCliente();
    fetchForniture();
    fetchFatture();
  }, [fetchFatture, id, token]);

  const creaFattura = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti/${id}/fattura?mese=${mese}&anno=${anno}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      fetchFatture();
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <Container fluid className="flex-grow-1">
        <h1>Cliente - {cliente.ragioneSociale}</h1>
        <div className="border rounded-3 mb-3">
          <div className="border rounded-3 bg-body-tertiary">
            <h3 className="m-2">Riepilogo</h3>
            <div className="ag-theme-quartz-dark ">
              <AgGridReact
                rowData={rowDataCliente}
                columnDefs={colDefsCliente}
                autoSizeStrategy={autoSizeStrategy}
                domLayout={`autoHeight`}
                enableCellTextSelection={true}
              />
            </div>
          </div>
        </div>

        <div className="border rounded-3 bg-body-tertiary mb-3">
          <h3 className="m-2">Forniture</h3>
          <div className="ag-theme-quartz-dark ">
            <AgGridReact
              rowData={rowDataForniture}
              columnDefs={colDefsForniture}
              autoSizeStrategy={autoSizeStrategy}
              domLayout={`autoHeight`}
              enableCellTextSelection={true}
            />
          </div>
        </div>
        <div className="border rounded-3 bg-body-tertiary">
          <div className="d-flex align-items-center">
            <h3 className="m-2">Fatture</h3>
            <Form.Select
              style={{ width: "auto" }}
              className="mx-3 ms-auto"
              size="sm"
              onChange={e => setMese(e.target.value)}
              value={mese}>
              <option value="1">Gennaio</option>
              <option value="2">Febbraio</option>
              <option value="3">Marzo</option>
              <option value="4">Aprile</option>
              <option value="5">Maggio</option>
              <option value="6">Giugno</option>
              <option value="7">Luglio</option>
              <option value="8">Agosto</option>
              <option value="9">Settembre</option>
              <option value="10">Ottobre</option>
              <option value="11">Novembre</option>
              <option value="12">Dicembre</option>
            </Form.Select>
            <Form.Select style={{ width: "auto" }} size="sm" onChange={e => setAnno(e.target.value)} value={anno}>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </Form.Select>
            <Button variant="primary" size="sm" className="mx-3" onClick={creaFattura}>
              Crea fattura
            </Button>
          </div>
          <div className="ag-theme-quartz-dark ">
            <AgGridReact
              rowData={rowDataFatture}
              columnDefs={colDefsFatture}
              autoSizeStrategy={autoSizeStrategy}
              domLayout={`autoHeight`}
              enableCellTextSelection={true}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cliente;
