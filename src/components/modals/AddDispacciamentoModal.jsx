import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideAddDispacciamentoModalAction } from "../../redux/actions";
import axios from "axios";
import { useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const AddDispacciamentoModal = () => {
  const showAddDispacciamentoModal = useSelector(state => state.modal.showAddDispacciamentoModal);
  const modDispacciamentoId = useSelector(state => state.modal.modDispacciamentoId);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  const [dispacciamento, setDispacciamento] = useState({
    trimestre: 0,
    anno: 0,
    capacita: 0,
    eolico: 0,
    costoAm: 0,
    dis: 0,
    int73: 0,
    msd: 0,
    sicurezza: 0,
    trasmissione: 0,
  });

  const handleChange = event => {
    const id = event.target.id;
    let value = event.target.value;
    setDispacciamento(prevState => ({ ...prevState, [id]: value }));
  };

  const handlePost = async event => {
    event.preventDefault();
    const urlApi = `${import.meta.env.VITE_REACT_APP_API_URL}/dispacciamento`;
    if (modDispacciamentoId) {
      const url = urlApi + "/" + modDispacciamentoId;
      const response = await axios.put(url, dispacciamento, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 200) {
        dispatch(hideAddDispacciamentoModalAction());
      }
    } else {
      const url = urlApi;
      const response = await axios.post(url, dispacciamento, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 201) {
        dispatch(hideAddDispacciamentoModalAction());
      }
    }
  };

  const resetDispacciamento = () => {
    setDispacciamento({});
  };

  useEffect(() => {
    const fetchDispacciamento = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/dispacciamento/` + modDispacciamentoId;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDispacciamento(response.data);
    };

    if (modDispacciamentoId) fetchDispacciamento();
    else resetDispacciamento();
  }, [modDispacciamentoId, token]);

  return (
    <Modal size="lg" show={showAddDispacciamentoModal} onHide={() => dispatch(hideAddDispacciamentoModalAction())}>
      <Modal.Header closeButton>
        <Modal.Title>{modDispacciamentoId ? "Modifica dispacciamento" : "Aggiungi dispacciamento"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handlePost}>
          <Form.Group controlId="trimestre" className="mb-3">
            <Form.Label>Trimestre</Form.Label>
            <Form.Control type="number" value={dispacciamento.trimestre} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="anno" className="mb-3">
            <Form.Label>Anno</Form.Label>
            <Form.Control type="number" value={dispacciamento.anno} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="capacita" className="mb-3">
            <Form.Label>Capacità</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.capacita} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="eolico" className="mb-3">
            <Form.Label>Eolico</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.eolico} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="costoAm" className="mb-3">
            <Form.Label>Costo AM</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.costoAm} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="dis" className="mb-3">
            <Form.Label>DIS</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.dis} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="int73" className="mb-3">
            <Form.Label>INT73</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.int73} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="msd" className="mb-3">
            <Form.Label>MSD</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.msd} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="sicurezza" className="mb-3">
            <Form.Label>Sicurezza</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.sicurezza} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="trasmissione" className="mb-3">
            <Form.Label>Trasmissione</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.trasmissione} onChange={handleChange} />
          </Form.Group>
          <Button variant="primary" type="submit">
            {modDispacciamentoId ? "Modifica" : "Aggiungi"}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDispacciamentoModal;
