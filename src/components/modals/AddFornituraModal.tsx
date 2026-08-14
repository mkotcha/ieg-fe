import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { hideAddFornituraModalAction } from "../../redux/actions";
import { useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { Cliente, Fornitura, PagedResponse } from "../../types";

const AddFornituraModal = () => {
  const showAddFornituraModal = useAppSelector(state => state.modal.showAddFornituraModal);
  const modFornituraId = useAppSelector(state => state.modal.modFornituraId);
  const token = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();
  const [listaClienti, setListaClienti] = useState<Cliente[]>([]);
  const [fornitura, setFornitura] = useState<Record<string, string | number>>({
    id: "",
    bta: "TD",
    idCliente: "",
    codiceDistributore: "EDIST",
    comune: "",
    dataSwitch: "",
    dataSwitchOut: "",
    fatturazione: "MENSILE",
    fornitore: "",
    indirizzo: "",
    iva: 0,
    potenzaDisponibile: 0,
    potenzaImpegnata: 0,
    provincia: "",
    tipoContatore: "ORARIO",
    tipoPrelievo: "BT",
    cap: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const id = event.target.id;
    const value = event.target.value;
    setFornitura(prevState => ({ ...prevState, [id]: value }));
  };

  const handlePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const urlApi = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture`;
    if (modFornituraId) {
      const url = urlApi + "/" + modFornituraId;
      const response = await axios.put(url, fornitura, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 200) {
        dispatch(hideAddFornituraModalAction());
      }
    } else {
      const url = urlApi;
      const response = await axios.post(url, fornitura, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 201) {
        dispatch(hideAddFornituraModalAction());
      }
    }
  };

  const resetFornitura = () => {
    setFornitura({
      id: "",
      bta: "TD",
      idCliente: "",
      codiceDistributore: "EDIST",
      comune: "",
      dataSwitch: "",
      dataSwitchOut: "",
      fatturazione: "MENSILE",
      fornitore: "",
      indirizzo: "",
      iva: 0,
      potenzaDisponibile: 0,
      potenzaImpegnata: 0,
      provincia: "",
      tipoContatore: "ORARIO",
      tipoPrelievo: "BT",
      cap: "",
    });
  };

  useEffect(() => {
    const fetchListaClienti = async () => {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/clienti?size=10000`;
      const response = await axios.get<PagedResponse<Cliente>>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListaClienti(response.data.content);
    };

    if (showAddFornituraModal) {
      fetchListaClienti();
    }
  }, [showAddFornituraModal, token]);

  useEffect(() => {
    if (modFornituraId) {
      const fetchFornitura = async () => {
        const url = `${import.meta.env.VITE_REACT_APP_API_URL}/forniture/${modFornituraId}`;
        const response = await axios.get<Fornitura>(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setFornitura({
          id: data.id || "",
          bta: data.bta || "TD",
          idCliente: data.cliente ? String(data.cliente.id) : "",
          codiceDistributore: data.codiceDistributore || "EDIST",
          comune: data.comune || "",
          dataSwitch: data.dataSwitch || "",
          dataSwitchOut: data.dataSwitchOut || "",
          fatturazione: data.fatturazione || "MENSILE",
          fornitore: data.fornitore || "",
          indirizzo: data.indirizzo || "",
          iva: data.iva ?? 0,
          potenzaDisponibile: data.potenzaDisponibile ?? 0,
          potenzaImpegnata: data.potenzaImpegnata ?? 0,
          provincia: data.provincia || "",
          tipoContatore: data.tipoContatore || "ORARIO",
          tipoPrelievo: data.tipoPrelievo || "BT",
          cap: data.cap ?? "",
        });
      };
      fetchFornitura();
    } else {
      resetFornitura();
    }
  }, [modFornituraId, token]);

  return (
    <Modal
      size="lg"
      show={showAddFornituraModal}
      onHide={() => {
        dispatch(hideAddFornituraModalAction());
      }}
      aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title>{modFornituraId ? "Modifica fornitura" : "Aggiungi Fornitura"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePost}>
          {!modFornituraId && (
            <Form.Group className="mb-3" controlId="id">
              <Form.Label>POD</Form.Label>
              <Form.Control type="text" value={fornitura.id} onChange={handleChange} />
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="idCliente">
            <Form.Label>Cliente</Form.Label>
            <Form.Select onChange={handleChange} value={fornitura.idCliente}>
              <option value="" disabled>
                Seleziona un cliente
              </option>
              {listaClienti.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.ragioneSociale}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="indirizzo">
            <Form.Label>Indirizzo</Form.Label>
            <Form.Control type="text" value={fornitura.indirizzo} onChange={handleChange} />
          </Form.Group>

          <Row>
            <Form.Group as={Col} xs={3} className="mb-3" controlId="cap">
              <Form.Label>Cap</Form.Label>
              <Form.Control type="text" value={fornitura.cap} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} xs={3} className="mb-3" controlId="provincia">
              <Form.Label>Provincia</Form.Label>
              <Form.Control type="text" value={fornitura.provincia} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="comune">
              <Form.Label>Comune</Form.Label>
              <Form.Control type="text" value={fornitura.comune} onChange={handleChange} />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} className="mb-3" controlId="bta">
              <Form.Label>BTA</Form.Label>
              <Form.Select onChange={handleChange} value={fornitura.bta}>
                <option value="TD">TD</option>
                <option value="BTA">BTA</option>
                <option value="BTA1">BTA1</option>
                <option value="BTA2">BTA2</option>
                <option value="BTA3">BTA3</option>
                <option value="BTA4">BTA4</option>
                <option value="BTA5">BTA5</option>
                <option value="BTA6">BTA6</option>
                <option value="BTA6C">BTA6C</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="tipoPrelievo">
              <Form.Label>Tipo prelievo</Form.Label>
              <Form.Select onChange={handleChange} value={fornitura.tipoPrelievo}>
                <option value="BT">BT</option>
                <option value="MT">MT</option>
                <option value="AT">AT</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="tipoContatore">
              <Form.Label>Tipo contatore</Form.Label>
              <Form.Select onChange={handleChange} value={fornitura.tipoContatore}>
                <option value="ORARIO">Orario</option>
                <option value="FASCIA">Fascia</option>
                <option value="MONORARIO">Monorario</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} className="mb-3" controlId="codiceDistributore">
              <Form.Label>Distributore</Form.Label>
              <Form.Select onChange={handleChange} value={fornitura.codiceDistributore}>
                <option value="EDIST">E-Distribuzione S.p.a (ENELD)</option>
                <option value="A2A">A2A Reti Elettriche S.p.A. (AEMMILANO)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="fornitore">
              <Form.Label>Fornitore</Form.Label>
              <Form.Control type="text" value={fornitura.fornitore} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="fatturazione">
              <Form.Label>Fatturazione</Form.Label>
              <Form.Select onChange={handleChange} value={fornitura.fatturazione}>
                <option value="MENSILE">Mensile</option>
                <option value="BIMESTRALE">Bimestrale</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} className="mb-3" controlId="potenzaDisponibile">
              <Form.Label>Potenza disponibile</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={fornitura.potenzaDisponibile}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="potenzaImpegnata">
              <Form.Label>Potenza impegnata</Form.Label>
              <Form.Control type="number" step="0.01" value={fornitura.potenzaImpegnata} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="iva">
              <Form.Label>IVA</Form.Label>
              <Form.Control type="number" step="0.01" value={fornitura.iva} onChange={handleChange} />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} className="mb-3" controlId="dataSwitch">
              <Form.Label>Data switch</Form.Label>
              <Form.Control type="date" value={fornitura.dataSwitch} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="dataSwitchOut">
              <Form.Label>Data switch out</Form.Label>
              <Form.Control type="date" value={fornitura.dataSwitchOut} onChange={handleChange} />
            </Form.Group>
          </Row>

          <Button variant="primary" type="submit">
            {modFornituraId ? "Aggiorna" : "Aggiungi"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddFornituraModal;
