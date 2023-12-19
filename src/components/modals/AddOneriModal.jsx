import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { hideAddOneriModalAction } from "../../redux/actions";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const AddOneriModal = () => {
  const showAddOneriModal = useSelector(state => state.modal.showAddOneriModal);
  const modOneriId = useSelector(state => state.modal.modOneriId);
  const token = useSelector(state => state.auth.token);

  const [oneri, setOneri] = useState({
    tipo: "BTA1",
    qeTud: 0,
    qpTdm: 0,
    qfTud: 0,
    qfMis: 0,
    qeArim: 0,
    qeAsos: 0,
    qeUc3: 0,
    qpArim: 0,
    qpAsos: 0,
    qpOds: 0,
    qfArim: 0,
    qfAsos: 0,
    trimestre: Math.ceil((new Date().getMonth() + 1) / 3),
    anno: new Date().getFullYear(),
  });

  const dispatch = useDispatch();

  const handleChange = event => {
    const id = event.target.id;
    let value = event.target.value;
    setOneri(prevState => ({ ...prevState, [id]: value }));
  };

  const handlePost = async event => {
    event.preventDefault();
    const urlApi = `${import.meta.env.VITE_REACT_APP_API_URL}/oneri`;
    if (modOneriId) {
      const url = urlApi + modOneriId;
      const response = await axios.put(url, oneri, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 200) {
        dispatch(hideAddOneriModalAction());
      }
    } else {
      const url = urlApi;
      const response = await axios.post(url, oneri, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 201) {
        dispatch(hideAddOneriModalAction());
      }
    }
  };

  const resetOneri = () => {
    setOneri({
      tipo: "BTA1",
    });
  };

  useEffect(() => {
    if (!showAddOneriModal) resetOneri();
  }, [showAddOneriModal]);

  return (
    <Modal
      size="lg"
      show={showAddOneriModal}
      onHide={() => dispatch(hideAddOneriModalAction())}
      aria-labelledby="add-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="add-modal-sizes-title-lg">{modOneriId ? "Modifica oneri" : "Aggiungi oneri"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePost}>
          <Form.Group controlId="tipo" className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Select onChange={handleChange} value={oneri.tipo}>
              <option value="BTA1">BTA1</option>
              <option value="BTA2">BTA2</option>
              <option value="BTA3">BTA3</option>
              <option value="BTA4">BTA4</option>
              <option value="BTA5">BTA5</option>
              <option value="BTA6">BTA6</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="peTud" className="mb-3">
            <Form.Label>qeTud</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qeTud} />
          </Form.Group>
          <Form.Group controlId="qpTdm" className="mb-3">
            <Form.Label>qpTdm</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qpTdm} />
          </Form.Group>
          <Form.Group controlId="qfTud" className="mb-3">
            <Form.Label>qfTud</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qfTud} />
          </Form.Group>
          <Form.Group controlId="qfMis" className="mb-3">
            <Form.Label>qfMis</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qfMis} />
          </Form.Group>
          <Form.Group controlId="qeArim" className="mb-3">
            <Form.Label>qeArim</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qeArim} />
          </Form.Group>
          <Form.Group controlId="qeAsos" className="mb-3">
            <Form.Label>qeAsos</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qeAsos} />
          </Form.Group>
          <Form.Group controlId="qeUc3" className="mb-3">
            <Form.Label>qeUc3</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qeUc3} />
          </Form.Group>
          <Form.Group controlId="qpArim" className="mb-3">
            <Form.Label>qpArim</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qpArim} />
          </Form.Group>
          <Form.Group controlId="qpAsos" className="mb-3">
            <Form.Label>qpAsos</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qpAsos} />
          </Form.Group>
          <Form.Group controlId="qpOds" className="mb-3">
            <Form.Label>qpOds</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qpOds} />
          </Form.Group>
          <Form.Group controlId="qfArim" className="mb-3">
            <Form.Label>qfArim</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qfArim} />
          </Form.Group>
          <Form.Group controlId="qfAsos" className="mb-3">
            <Form.Label>qfAsos</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.qfAsos} />
          </Form.Group>
          <Form.Group controlId="trimestre" className="mb-3">
            <Form.Label>Trimestre</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.trimestre} />
          </Form.Group>
          <Form.Group controlId="anno" className="mb-3">
            <Form.Label>Anno</Form.Label>
            <Form.Control type="number" onChange={handleChange} value={oneri.anno} />
          </Form.Group>
          <Button variant="primary" type="submit">
            {modOneriId ? "Aggiorna" : "Aggiungi"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddOneriModal;
