import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Cliente = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState({});
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchCliente = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti/${id}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCliente(response.data);
    };
    fetchCliente();
  }, [id, token]);

  return (
    <>
      <Container fluid>
        <h1>Cliente - {cliente.ragioneSociale}</h1>
      </Container>
    </>
  );
};

export default Cliente;
