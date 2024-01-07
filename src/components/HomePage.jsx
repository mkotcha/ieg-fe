import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [clienti, setClienti] = useState(null);
  const [forniture, setForniture] = useState(null);
  const [fatture, setFatture] = useState(null);
  const [lettureMancanti, setLettureMancanti] = useState([]);
  const currentMonth = new Date().getMonth();
  const [mese, setMese] = useState(currentMonth === 0 ? 12 : currentMonth);
  const [anno, setAnno] = useState(currentMonth === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear());
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchClienti = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti?size=50`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClienti(response.data.content);
    };
    const fetchForniture = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture?size=50`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForniture(response.data.content);
    };
    const fetchFatture = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/fatture`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFatture(response.data.content);
    };

    if (clienti === null) fetchClienti();
    if (forniture === null) fetchForniture();
    if (fatture === null) fetchFatture();
  }, [clienti, fatture, forniture, token]);

  const checkLetture = async () => {
    setLettureMancanti([]);
    if (forniture) {
      for (const fornitura of forniture) {
        const url = `${import.meta.env.VITE_REACT_APP_API_URL}/letture/conta/${fornitura.id}?mese=${mese}&anno=${anno}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const num = parseInt(response.data, 10);
        if (num < 2) {
          setLettureMancanti(prevState => [...prevState, { id: fornitura.id, num: num }]);
        }
      }
    }
  };

  return (
    <Container fluid className="content">
      <h1>Home Page</h1>

      <div className="border rounded-3 ">
        <div className="bg-body-tertiary p-2">
          <h3>Riepilogo</h3>
        </div>
        <div className="p-2">
          <div>
            <div>totale clienti: {clienti?.length}</div>
          </div>
          <div>
            <div>totale forniture: {forniture?.length}</div>
          </div>
          <div>
            <div className="d-flex align-items-center">
              <div>Periodo: </div>
              <Form.Select
                style={{ width: "auto" }}
                className="mx-3"
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
              </Form.Select>
            </div>
            <div>
              totale fatture emesse: {fatture?.length} / {clienti?.length}
            </div>
            <div>
              pod con letture mancanti:
              <Button onClick={checkLetture} size="sm" variant="warning" className="mx-2">
                verifica
              </Button>
              {lettureMancanti.length}{" "}
            </div>
            <div>
              {lettureMancanti.map(pod => (
                <div key={pod.id} className="font-monospace">
                  <Link to={`/letture/${pod.id}`}>{pod.id}</Link> - {pod.num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
