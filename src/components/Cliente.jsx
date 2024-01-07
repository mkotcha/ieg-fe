import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Cliente = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState({});
  const token = useSelector(state => state.auth.token);
  const [rowData, setRowData] = useState([]);
  const [colDefs] = useState([
    {
      field: "id",
      headerName: "POD",
      cellRenderer: function (params) {
        return (
          <Link to={`/fornitura/${params.value}`} className="text-decoration-none text-reset">
            {params.value}
          </Link>
        );
      },
    },
    { field: "cliente.ragioneSociale", headerName: "Ragione sociale" },
    { field: "indirizzo" },
    { field: "comune" },
    { field: "provincia" },
    { field: "cap" },
    { field: "dataSwitch" },
  ]);

  useEffect(() => {
    const fetchCliente = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti/${id}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCliente(response.data);
    };
    const fetchForniture = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti/${id}/forniture`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRowData(response.data);
    };
    fetchCliente();
    fetchForniture();
  }, [id, token]);

  return (
    <>
      <Container fluid className="flex-grow-1">
        <h1>Cliente - {cliente.ragioneSociale}</h1>
        <div className="border rounded-3 ">
          <div className="bg-body-tertiary p-2">
            <h3>dettagli</h3>
          </div>
          <div className="p-2"></div>
        </div>
      </Container>
    </>
  );
};

export default Cliente;
