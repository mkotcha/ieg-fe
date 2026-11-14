import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import type { Lavoro, TipoLavoro } from "../types";
import { erroreApi } from "../utils/erroreApi";

const INTERVALLO_POLLING = 1000;

/**
 * Segue un'operazione lunga del backend (generazione fatture, import letture) con il polling di GET /lavori/{id}.
 * All'apertura riprende il lavoro del tipo se è ancora in corso (es. dopo aver ricaricato la pagina).
 *
 * @returns il lavoro (null se nessuno), avvia(richiesta) per lanciarne uno con la POST che lo restituisce,
 * l'errore di avvio o di polling e chiudi() per nascondere un lavoro terminato
 */
export const useLavoro = <R>(tipo: TipoLavoro) => {
  const token = useAppSelector(state => state.auth.token);
  const [lavoro, setLavoro] = useState<Lavoro<R> | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const api = import.meta.env.VITE_REACT_APP_API_URL;
  const inCorso = lavoro?.stato === "IN_CORSO";
  const idRef = useRef<string | null>(null);
  idRef.current = lavoro?.id ?? null;

  // ripresa di un lavoro in corso
  useEffect(() => {
    if (!token) return;
    axios
      .get<Lavoro<R>>(`${api}/lavori/ultimo?tipo=${tipo}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 200 && r.data.stato === "IN_CORSO" && !idRef.current) setLavoro(r.data);
      })
      .catch(() => {
        // senza stato da riprendere la pagina funziona comunque
      });
  }, [api, tipo, token]);

  // polling finché il lavoro è in corso
  useEffect(() => {
    if (!inCorso || !lavoro) return;
    const id = lavoro.id;
    const timer = window.setInterval(async () => {
      try {
        const r = await axios.get<Lavoro<R>>(`${api}/lavori/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (idRef.current === id) setLavoro(r.data);
      } catch (error) {
        setErrore(erroreApi(error, "Stato dell'operazione non disponibile"));
        window.clearInterval(timer);
      }
    }, INTERVALLO_POLLING);
    return () => window.clearInterval(timer);
    // si riavvia solo quando cambia il lavoro o finisce
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, token, inCorso, lavoro?.id]);

  const avvia = useCallback(async (richiesta: () => Promise<{ data: Lavoro<R> }>) => {
    setErrore(null);
    try {
      const r = await richiesta();
      setLavoro(r.data);
      return r.data;
    } catch (error) {
      setErrore(erroreApi(error, "Impossibile avviare l'operazione"));
      return null;
    }
  }, []);

  const chiudi = useCallback(() => {
    setLavoro(null);
    setErrore(null);
  }, []);

  return { lavoro, inCorso, errore, avvia, chiudi };
};
