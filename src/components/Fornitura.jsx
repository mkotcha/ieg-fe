import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Fornitura = () => {
  const { id } = useParams();
  const [fornitura, setFornitura] = useState({});
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchFornitura = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture/${id}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFornitura(response.data);
    };
    fetchFornitura();
  }, [id, token]);

  return (
    <>
      <Container fluid className="flex-grow-1">
        <h1>Fornitura - {id}</h1>
        <div>
          <div>
            <div className="d-flex flex-row">
              <div className="me-3">Cliente</div>
              <div>
                <Link to={`/cliente/${fornitura.cliente?.id}`}>{fornitura.cliente?.ragioneSociale}</Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Fornitura;
