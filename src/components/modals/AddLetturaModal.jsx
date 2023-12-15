import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { hideAddLetturaModalAction } from "../../redux/actions";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const AddLetturaModal = () => {
  const showAddModal = useSelector(state => state.modal.showAddLetturaModal);
  const token = useSelector(state => state.auth.token);
  const [listaPod, setListaPod] = useState(null);
  const [lettura, setLettura] = useState({
    dataLettura: "",
    tipoLettura: "AUTOLETTURA",
    tipoContatore: "ORARIO",
    tipoDato: "R",
    raccolta: "P",
    validato: "S",
  });
  const dispatch = useDispatch();

  const handlePost = async () => {};

  const handleChange = event => {
    const id = event.target.id;
    let value = event.target.value;
    if (id === "tipoLettura") {
      let tipoDato = lettura.tipoDato;
      let raccolta = lettura.raccolta;
      if (value === "STIMA") {
        tipoDato = "S";
      } else if (value === "CAMBIO") {
        raccolta = "T";
      } else {
        tipoDato = "R";
        raccolta = "P";
      }
      setLettura({ ...lettura, [`tipoDato`]: tipoDato, [`raccolta`]: raccolta, [id]: value });
    } else {
      setLettura({ ...lettura, [id]: value });
    }
  };

  useEffect(() => {
    console.log(lettura);
  }, [lettura]);

  useEffect(() => {
    async function fetchListaPod() {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture/listapod`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListaPod(response.data);
      setLettura({ ...lettura, pod: response.data[0] });
    }
    if (showAddModal && !listaPod) {
      fetchListaPod();
    }
  }, [lettura, listaPod, showAddModal, token]);

  return (
    <Modal
      size="lg"
      show={showAddModal}
      onHide={() => dispatch(hideAddLetturaModalAction())}
      aria-labelledby="add-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="add-modal-sizes-title-lg">Aggiungi lettura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePost}>
          <Form.Group controlId="pod" className="mb-3">
            <Form.Label>POD</Form.Label>
            <Form.Select onChange={handleChange} value={lettura.pod}>
              {listaPod &&
                listaPod.map(pod => (
                  <option key={pod} value={pod}>
                    {pod}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="dataLettura" className="mb-3">
            <Form.Label>Data lettura</Form.Label>
            <Form.Control type="text" onChange={handleChange} value={lettura.dataLettura} placeholder="yyyy-MM-gg" />
          </Form.Group>
          <Form.Group controlId="tipoLettura" className="mb-3">
            <Form.Label>Tipo lettura</Form.Label>
            <Form.Select onChange={handleChange} value={lettura.tipoLettura}>
              <option value="AUTOLETTURA">Autolettura</option>
              <option value="CAMBIO">Cambio contatore</option>
              <option value="REALE">Reale</option>
              <option value="RETTIFICA">Rettifica</option>
              <option value="STIMA">Stima</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="tipoContatore" className="mb-3">
            <Form.Label>Tipo contatore</Form.Label>
            <Form.Select onChange={handleChange} value={lettura.tipoContatore}>
              <option value="ORARIO">Orario</option>
              <option value="FASCIA">Fascia</option>
              <option value="MONORARIO">Monorario</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Form.Group controlId="eaF1" className="mb-3">
              <Form.Label>EaF1</Form.Label>
              <Form.Control type="number" onChange={handleChange} value={lettura.eaF1} />
            </Form.Group>
            <Form.Group controlId="eaF2" className="mb-3">
              <Form.Label>EaF2</Form.Label>
              <Form.Control type="number" onChange={handleChange} value={lettura.eaF2} />
            </Form.Group>
            <Form.Group controlId="eaF3" className="mb-3">
              <Form.Label>EaF3</Form.Label>
              <Form.Control type="number" onChange={handleChange} value={lettura.eaF3} />
            </Form.Group>
          </div>
          <div className="d-flex justify-content-between">
            <Form.Group controlId="erF1" className="mb-3">
              <Form.Label>ErF1</Form.Label>
              <Form.Control type="number" onChange={handleChange} value={lettura.erF1} />
            </Form.Group>
            <Form.Group controlId="erF2" className="mb-3">
              <Form.Label>ErF2</Form.Label>
              <Form.Control type="number" onChange={handleChange} value={lettura.erF2} />
            </Form.Group>
            <Form.Group controlId="erF3" className="mb-3">
              <Form.Label>ErF3</Form.Label>
              <Form.Control type="number" onChange={handleChange} value={lettura.erF3} />
            </Form.Group>
          </div>
          <div className="d-flex justify-content-between">
            <Form.Group controlId="potF1" className="mb-3">
              <Form.Label>PotF1</Form.Label>
              <Form.Control type="number" onChange={handleChange} value={lettura.potF1} />
            </Form.Group>
            <Form.Group controlId="potF2" className="mb-3">
              <Form.Label>PotF2</Form.Label>
              <Form.Control type="number" onChange={handleChange} value={lettura.potF2} />
            </Form.Group>
            <Form.Group controlId="potF3" className="mb-3">
              <Form.Label>PotF3</Form.Label>
              <Form.Control type="number" onChange={handleChange} value={lettura.potF3} />
            </Form.Group>
          </div>
          <Form.Group controlId="note" className="mb-3">
            <Form.Label>Note</Form.Label>
            <Form.Control type="text" onChange={handleChange} value={lettura.note} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Aggiungi
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddLetturaModal;
