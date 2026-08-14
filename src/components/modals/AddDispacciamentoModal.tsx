import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { hideAddDispacciamentoModalAction } from "../../redux/actions";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { Dispacciamento } from "../../types";

const AddDispacciamentoModal = () => {
  const showAddDispacciamentoModal = useAppSelector(state => state.modal.showAddDispacciamentoModal);
  const modDispacciamentoId = useAppSelector(state => state.modal.modDispacciamentoId);
  const token = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();

  const [dispacciamento, setDispacciamento] = useState<Record<string, string | number>>({
    mese: 0,
    anno: 0,
    capacita: 0,
    costoAm: 0,
    dis: 0,
    sbilanciamento: 0,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    const value = event.target.value;
    setDispacciamento(prevState => ({ ...prevState, [id]: value }));
  };

  const handlePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      mese: Number(dispacciamento.mese),
      anno: Number(dispacciamento.anno),
      capacita: Number(dispacciamento.capacita),
      costoAm: Number(dispacciamento.costoAm),
      dis: Number(dispacciamento.dis),
      sbilanciamento: Number(dispacciamento.sbilanciamento),
    };
    const urlApi = `${import.meta.env.VITE_REACT_APP_API_URL}/dispacciamento`;
    if (modDispacciamentoId) {
      const url = urlApi + "/" + modDispacciamentoId;
      const response = await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 200) {
        dispatch(hideAddDispacciamentoModalAction());
      }
    } else {
      const url = urlApi;
      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 201) {
        dispatch(hideAddDispacciamentoModalAction());
      }
    }
  };

  const resetDispacciamento = () => {
    setDispacciamento({
      mese: 0,
      anno: 0,
      capacita: 0,
      costoAm: 0,
      dis: 0,
      sbilanciamento: 0,
    });
  };

  useEffect(() => {
    const fetchDispacciamento = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/dispacciamento/` + modDispacciamentoId;
      const response = await axios.get<Dispacciamento>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setDispacciamento({
        mese: data.mese ?? 0,
        anno: data.anno ?? 0,
        capacita: data.capacita ?? 0,
        costoAm: data.costoAm ?? 0,
        dis: data.dis ?? 0,
        sbilanciamento: data.sbilanciamento ?? 0,
      });
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
          <Form.Group controlId="mese" className="mb-3">
            <Form.Label>Mese</Form.Label>
            <Form.Control type="number" value={dispacciamento.mese} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="anno" className="mb-3">
            <Form.Label>Anno</Form.Label>
            <Form.Control type="number" value={dispacciamento.anno} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="capacita" className="mb-3">
            <Form.Label>Capacità</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.capacita} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="costoAm" className="mb-3">
            <Form.Label>Costo AM</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.costoAm} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="dis" className="mb-3">
            <Form.Label>DIS</Form.Label>
            <Form.Control type="number" step="0.000001" value={dispacciamento.dis} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="sbilanciamento" className="mb-3">
            <Form.Label>Sbilanciamento</Form.Label>
            <Form.Control
              type="number"
              step="0.000001"
              value={dispacciamento.sbilanciamento}
              onChange={handleChange}
            />
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
