import axios from "axios";
import { useRef, useState, type FormEvent } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useLavoro } from "../../hooks/useLavoro";
import { hideUploadModalAction } from "../../redux/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { EsitoImportLetture } from "../../types";
import AvanzamentoLavoro from "../AvanzamentoLavoro";

/**
 * Carica lo zip dei flussi di misura: l'upload è sincrono, l'import prosegue in background con la barra di
 * avanzamento. Il modale si può chiudere durante l'import e riaprire per seguirlo.
 */
const UploadFlussiModal = () => {
  const token = useAppSelector(state => state.auth.token);
  const showUploadModal = useAppSelector(state => state.modal.showUploadModal);
  const dispatch = useAppDispatch();
  const importazione = useLavoro<EsitoImportLetture>("IMPORT_LETTURE");
  const [upload, setUpload] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const esito = importazione.lavoro?.stato === "COMPLETATO" ? importazione.lavoro.risultato : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("flussi", file);
    setUpload(true);
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/letture/flussi`;
    await importazione.avvia(() => axios.post(url, formData, { headers: { Authorization: `Bearer ${token}` } }));
    setUpload(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const occupato = upload || importazione.inCorso;

  return (
    <Modal
      size="lg"
      show={showUploadModal}
      onHide={() => dispatch(hideUploadModalAction())}
      aria-labelledby="upload-flussi-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="upload-flussi-modal-title">Carica flussi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="flussi" className="mb-3">
            <Form.Label>Carica i flussi in formato .zip</Form.Label>
            <Form.Control ref={fileRef} type="file" accept=".zip" disabled={occupato} />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={occupato}>
            {upload ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" /> caricamento file...
              </>
            ) : (
              "Carica"
            )}
          </Button>
        </Form>
        {importazione.errore && (
          <Alert variant="danger" className="py-2 mt-3 mb-0">
            {importazione.errore}
          </Alert>
        )}
        {importazione.lavoro && (
          <div className="mt-3">
            <AvanzamentoLavoro lavoro={importazione.lavoro} onChiudi={importazione.chiudi} />
            {importazione.inCorso && (
              <div className="small text-body-secondary">
                Puoi chiudere questa finestra: l&apos;import prosegue e riaprendola ne vedi l&apos;avanzamento.
              </div>
            )}
          </div>
        )}
        {esito && (
          <ul className="small mt-2 mb-0">
            <li>
              file letti: {esito.file - esito.fileScartati} / {esito.file}
            </li>
            <li>letture nuove: {esito.inserite}</li>
            <li>letture aggiornate: {esito.aggiornate}</li>
            {esito.switchMantenute > 0 && (
              <li>letture periodiche ignorate (c&apos;è già la lettura di switch): {esito.switchMantenute}</li>
            )}
            {esito.errori > 0 && <li className="text-warning">misure non importate per dati non validi: {esito.errori}</li>}
            {esito.podSconosciuti.length > 0 && (
              <li className="text-warning">
                POD non in anagrafica ({esito.podSconosciuti.length}):{" "}
                <span className="font-monospace">{esito.podSconosciuti.join(", ")}</span>
              </li>
            )}
          </ul>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UploadFlussiModal;
