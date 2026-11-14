import { useEffect, useState } from "react";
import { Alert, CloseButton, ProgressBar } from "react-bootstrap";
import type { Lavoro } from "../types";

/** Secondi trascorsi dall'inizio del lavoro (fino alla fine, se terminato), aggiornati ogni secondo. */
const useDurata = (lavoro: Lavoro) => {
  const [adesso, setAdesso] = useState(() => Date.now());
  useEffect(() => {
    if (lavoro.stato !== "IN_CORSO") return;
    const timer = window.setInterval(() => setAdesso(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [lavoro.stato]);
  const fine = lavoro.fine ? new Date(lavoro.fine).getTime() : adesso;
  return Math.max(0, Math.round((fine - new Date(lavoro.inizio).getTime()) / 1000));
};

const formatDurata = (secondi: number) =>
  secondi < 60 ? `${secondi} s` : `${Math.floor(secondi / 60)} min ${String(secondi % 60).padStart(2, "0")} s`;

/**
 * Barra di avanzamento di un'operazione in background: fase, fatti/totale, durata ed errori sui singoli elementi.
 */
const AvanzamentoLavoro = ({ lavoro, onChiudi }: { lavoro: Lavoro; onChiudi?: () => void }) => {
  const durata = useDurata(lavoro);
  const indeterminato = lavoro.totale === 0;
  const percentuale = indeterminato ? 100 : Math.round((lavoro.fatti / lavoro.totale) * 100);
  const inCorso = lavoro.stato === "IN_CORSO";
  const variante = lavoro.stato === "FALLITO" ? "danger" : lavoro.errori > 0 ? "warning" : inCorso ? "primary" : "success";

  return (
    <div className="my-2">
      <div className="d-flex flex-wrap gap-2 small mb-1">
        <span className="fw-semibold">{lavoro.descrizione}</span>
        <span className="text-body-secondary">
          {inCorso ? lavoro.fase : lavoro.stato === "COMPLETATO" ? "completata" : "interrotta"}
          {!indeterminato && ` · ${lavoro.fatti} / ${lavoro.totale}`}
        </span>
        {lavoro.errori > 0 && <span className="text-warning">· {lavoro.errori} errori</span>}
        <span className="ms-auto text-body-secondary">{formatDurata(durata)}</span>
        {!inCorso && onChiudi && (
          <CloseButton aria-label="chiudi" title="chiudi" onClick={onChiudi} style={{ fontSize: "0.6rem" }} />
        )}
      </div>
      <ProgressBar
        now={percentuale}
        label={!indeterminato && inCorso ? `${percentuale}%` : undefined}
        striped={inCorso}
        animated={inCorso}
        variant={variante}
      />
      {lavoro.errore && (
        <Alert variant="danger" className="py-2 mt-2 mb-0">
          {lavoro.errore}
        </Alert>
      )}
      {lavoro.messaggi.length > 0 && (
        <details className="small mt-1">
          <summary className="text-warning">dettaglio errori</summary>
          <ul className="mb-0">
            {lavoro.messaggi.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
          {lavoro.errori > lavoro.messaggi.length && <div>... e altri {lavoro.errori - lavoro.messaggi.length}</div>}
        </details>
      )}
    </div>
  );
};

export default AvanzamentoLavoro;
