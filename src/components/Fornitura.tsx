import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { Fornitura as FornituraType } from "../types";

const Fornitura = () => {
  const { id } = useParams();
  const [fornitura, setFornitura] = useState<Partial<FornituraType>>({});
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFornitura = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture/${id}`;
      const response = await axios.get<FornituraType>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFornitura(response.data);
    };
    fetchFornitura();
  }, [id, token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

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
