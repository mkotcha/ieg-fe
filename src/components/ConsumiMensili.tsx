import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Alert, ButtonGroup, Form, Spinner, Table, ToggleButton } from "react-bootstrap";
import { useAppSelector } from "../redux/hooks";
import type { ConsumoMensile } from "../types";
import { erroreApi } from "../utils/erroreApi";
import { formatNumero, NOMI_MESI } from "../utils/formato";

// categorici 1-3 della palette di riferimento, varianti per il tema scuro (validati sulla superficie delle schede)
const FASCE = [
  { chiave: "f1", nome: "F1", colore: "#3987e5" },
  { chiave: "f2", nome: "F2", colore: "#d95926" },
  { chiave: "f3", nome: "F3", colore: "#199e70" },
] as const;

const PERIODI = [12, 24, 36];
type Vista = "impilate" | "affiancate";
const CHIAVE_VISTA = "ieg.consumi.vista";

/** Vista scelta l'ultima volta, solo per comodità di chi guarda: senza storage si parte da impilate. */
const vistaSalvata = (): Vista => {
  try {
    return localStorage.getItem(CHIAVE_VISTA) === "affiancate" ? "affiancate" : "impilate";
  } catch {
    return "impilate";
  }
};
const ALTEZZA = 260;
const MARGINE = { alto: 22, destra: 34, basso: 30, sinistra: 52 };
const SPAZIO = 2; // gap tra i segmenti impilati, nel colore della superficie
const RAGGIO = 4;

/** Slot di un mese nel grafico: il consumo se c'è, null per i mesi senza letture sufficienti. */
interface Slot {
  mese: number;
  anno: number;
  consumo: ConsumoMensile | null;
}

const formatData = (d: string) => new Date(d).toLocaleDateString("it-IT");
const nomeMese = (s: { mese: number; anno: number }) => `${NOMI_MESI[s.mese - 1]} ${s.anno}`;

/** Massimo "tondo" dell'asse e passo delle tacche (circa 4 intervalli). */
const scala = (massimo: number) => {
  if (massimo <= 0) return { max: 1, passo: 1 };
  const grezzo = massimo / 4;
  const potenza = 10 ** Math.floor(Math.log10(grezzo));
  const passo = [1, 2, 2.5, 5, 10].map(m => m * potenza).find(p => p >= grezzo) ?? grezzo;
  return { max: Math.ceil(massimo / passo) * passo, passo };
};

/** Rettangolo con i soli angoli superiori arrotondati (estremo dei dati), base squadrata. */
const colonnaArrotondata = (x: number, y: number, w: number, h: number) => {
  const r = Math.min(RAGGIO, h, w / 2);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
};

/**
 * Andamento dei consumi mensili per fascia (F1/F2/F3 sommate o affiancate), dalle letture: di una fornitura
 * (percorso /forniture/{pod}/consumi) o di un cliente, sommando i suoi pod (/clienti/{id}/consumi).
 * I mesi che non coprono tutto il mese (per un cliente: per tutti i pod) sono più chiari; quelli senza letture
 * restano vuoti.
 */
const ConsumiMensili = ({ percorso, titolo = "Andamento consumi" }: { percorso: string; titolo?: string }) => {
  const token = useAppSelector(state => state.auth.token);
  const [mesi, setMesi] = useState(24);
  const [consumi, setConsumi] = useState<ConsumoMensile[] | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const [tabella, setTabella] = useState(false);
  const [vista, setVista] = useState<Vista>(vistaSalvata);
  const affiancate = vista === "affiancate";
  const [attivo, setAttivo] = useState<number | null>(null);
  // contenitore del grafico: esiste solo quando ci sono i dati, quindi si osserva con una ref a callback
  const [contenitore, setContenitore] = useState<HTMLDivElement | null>(null);
  const [larghezza, setLarghezza] = useState(800);

  useEffect(() => {
    if (!token) return;
    setErrore(null);
    axios
      .get<ConsumoMensile[]>(`${import.meta.env.VITE_REACT_APP_API_URL}${percorso}?mesi=${mesi}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(r => setConsumi(r.data))
      .catch(error => setErrore(erroreApi(error, "Errore nel caricamento dei consumi")));
  }, [percorso, mesi, token]);

  const cambiaVista = (v: Vista) => {
    setVista(v);
    try {
      localStorage.setItem(CHIAVE_VISTA, v);
    } catch {
      // senza storage la scelta vale fino al ricaricamento
    }
  };

  // larghezza reale del contenitore: testi e colonne restano della dimensione giusta a ogni larghezza
  useEffect(() => {
    if (!contenitore) return;
    setLarghezza(Math.max(320, contenitore.getBoundingClientRect().width));
    const osservatore = new ResizeObserver(([voce]) => setLarghezza(Math.max(320, voce.contentRect.width)));
    osservatore.observe(contenitore);
    return () => osservatore.disconnect();
  }, [contenitore]);

  // tutti i mesi del periodo, anche quelli senza consumo, così l'asse del tempo è continuo
  const slot = useMemo<Slot[]>(() => {
    const oggi = new Date();
    const elenco: Slot[] = [];
    for (let i = mesi - 1; i >= 0; i--) {
      const d = new Date(oggi.getFullYear(), oggi.getMonth() - i, 1);
      const mese = d.getMonth() + 1;
      const anno = d.getFullYear();
      elenco.push({
        mese,
        anno,
        consumo: consumi?.find(c => c.mese === mese && c.anno === anno) ?? null,
      });
    }
    return elenco;
  }, [consumi, mesi]);

  const larghezzaPlot = larghezza - MARGINE.sinistra - MARGINE.destra;
  const altezzaPlot = ALTEZZA - MARGINE.alto - MARGINE.basso;
  // impilate: l'asse arriva al totale del mese; affiancate: alla fascia più alta, così le barre restano leggibili
  const { max, passo } = scala(
    Math.max(
      0,
      ...slot.map(s =>
        !s.consumo ? 0 : affiancate ? Math.max(s.consumo.f1, s.consumo.f2, s.consumo.f3) : s.consumo.totale,
      ),
    ),
  );
  const banda = larghezzaPlot / slot.length;
  const colonna = Math.min(24, banda * 0.7);
  // affiancate: tre barre con il gap di superficie, il gruppo occupa al più l'80% della banda
  const barra = Math.min(16, (banda * 0.8 - 2 * SPAZIO) / 3);
  const gruppo = 3 * barra + 2 * SPAZIO;
  const y = (v: number) => MARGINE.alto + altezzaPlot - (v / max) * altezzaPlot;
  // etichette dei mesi diradate se la banda è stretta (circa 34px per etichetta)
  const ogni = Math.ceil(34 / banda);
  const tacche = Array.from({ length: Math.round(max / passo) + 1 }, (_, i) => i * passo);
  // etichette dirette accanto all'ultima colonna, nel margine destro
  const ultimaColonna = slot[slot.length - 1]?.consumo ? slot[slot.length - 1] : null;
  const mediaCompleti = (() => {
    const completi = slot.filter(s => s.consumo?.completo);
    return completi.length ? completi.reduce((a, s) => a + (s.consumo?.totale ?? 0), 0) / completi.length : null;
  })();

  const selezionato = attivo !== null ? slot[attivo] : null;

  return (
    <div className="border rounded-3 bg-body-tertiary mb-3">
      <div className="d-flex flex-wrap align-items-center gap-2 m-2">
        <h3 className="m-0 me-auto">{titolo}</h3>
        <ButtonGroup size="sm">
          {(["impilate", "affiancate"] as const).map(v => (
            <ToggleButton
              key={v}
              id={`consumi-vista-${v}`}
              type="radio"
              variant="outline-secondary"
              value={v}
              checked={vista === v}
              onChange={() => cambiaVista(v)}>
              {v === "impilate" ? "fasce sommate" : "fasce affiancate"}
            </ToggleButton>
          ))}
        </ButtonGroup>
        <ButtonGroup size="sm">
          {PERIODI.map(p => (
            <ToggleButton
              key={p}
              id={`consumi-${p}`}
              type="radio"
              variant="outline-secondary"
              value={p}
              checked={mesi === p}
              onChange={() => setMesi(p)}>
              {p} mesi
            </ToggleButton>
          ))}
        </ButtonGroup>
        <Form.Check
          type="switch"
          id="consumi-tabella"
          label="tabella"
          checked={tabella}
          onChange={e => setTabella(e.target.checked)}
        />
      </div>
      {errore && (
        <Alert variant="danger" className="py-2 mx-2">
          {errore}
        </Alert>
      )}
      {!consumi && !errore && <Spinner animation="border" size="sm" className="m-2" />}
      {consumi && consumi.length === 0 && <div className="m-2">Nessuna lettura sufficiente nel periodo.</div>}
      {consumi && consumi.length > 0 && (
        <>
          <div className="d-flex flex-wrap gap-3 mx-2 small text-body-secondary">
            {FASCE.map(f => (
              <span key={f.chiave} className="d-inline-flex align-items-center gap-1">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: f.colore,
                    display: "inline-block",
                  }}
                />
                {f.nome}
              </span>
            ))}
            <span className="d-inline-flex align-items-center gap-1">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: FASCE[0].colore,
                  opacity: 0.4,
                }}
                className="d-inline-block"
              />
              mese non coperto per intero
            </span>
            {mediaCompleti !== null && (
              <span className="ms-auto">media mesi completi: {formatNumero(mediaCompleti, 0)} kWh</span>
            )}
          </div>

          {tabella ? (
            <Table size="sm" striped bordered className="m-2 small w-auto">
              <thead>
                <tr>
                  <th>Mese</th>
                  {FASCE.map(f => (
                    <th key={f.chiave} className="text-end">
                      {f.nome} kWh
                    </th>
                  ))}
                  <th className="text-end">Totale kWh</th>
                  <th>Letture</th>
                </tr>
              </thead>
              <tbody>
                {[...slot].reverse().map(s => (
                  <tr key={`${s.anno}-${s.mese}`}>
                    <td>{nomeMese(s)}</td>
                    {s.consumo ? (
                      <>
                        {FASCE.map(f => (
                          <td key={f.chiave} className="text-end">
                            {formatNumero(s.consumo?.[f.chiave], 0)}
                          </td>
                        ))}
                        <td className="text-end fw-semibold">{formatNumero(s.consumo.totale, 0)}</td>
                        <td className={s.consumo.completo ? "" : "text-warning"}>
                          {formatData(s.consumo.dal)} - {formatData(s.consumo.al)}
                          {!s.consumo.completo && " (parziale)"}
                        </td>
                      </>
                    ) : (
                      <td colSpan={5} className="text-body-secondary">
                        letture insufficienti
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div ref={setContenitore} className="position-relative mx-2 mb-2" onMouseLeave={() => setAttivo(null)}>
              <svg
                width={larghezza}
                height={ALTEZZA}
                role="img"
                aria-label={`Consumi mensili per fascia degli ultimi ${mesi} mesi`}
                style={{ display: "block" }}>
                {/* griglia e asse y, recessivi */}
                {tacche.map(t => (
                  <g key={t}>
                    <line
                      x1={MARGINE.sinistra}
                      x2={larghezza - MARGINE.destra}
                      y1={y(t)}
                      y2={y(t)}
                      stroke="var(--bs-border-color)"
                      strokeOpacity={t === 0 ? 1 : 0.5}
                    />
                    <text
                      x={MARGINE.sinistra - 6}
                      y={y(t)}
                      dy="0.32em"
                      textAnchor="end"
                      fontSize={11}
                      fill="var(--bs-secondary-color)">
                      {formatNumero(t, 0)}
                    </text>
                  </g>
                ))}
                <text
                  x={MARGINE.sinistra - 6}
                  y={MARGINE.alto - 10}
                  textAnchor="end"
                  fontSize={11}
                  fill="var(--bs-secondary-color)">
                  kWh
                </text>

                {slot.map((s, i) => {
                  const cx = MARGINE.sinistra + banda * i + banda / 2;
                  const x = cx - colonna / 2;
                  const c = s.consumo;
                  let base = y(0);
                  const visibili = c ? FASCE.filter(f => c[f.chiave] > 0) : [];
                  return (
                    <g key={`${s.anno}-${s.mese}`} opacity={attivo !== null && attivo !== i ? 0.45 : 1}>
                      {c &&
                        affiancate &&
                        FASCE.map((f, k) => {
                          const h = (c[f.chiave] / max) * altezzaPlot;
                          if (h <= 0) return null;
                          return (
                            <path
                              key={f.chiave}
                              d={colonnaArrotondata(cx - gruppo / 2 + k * (barra + SPAZIO), y(0) - h, barra, h)}
                              fill={f.colore}
                              fillOpacity={c.completo ? 1 : 0.4}
                            />
                          );
                        })}
                      {c &&
                        !affiancate &&
                        visibili.map((f, k) => {
                          const h = (c[f.chiave] / max) * altezzaPlot;
                          const top = base - h;
                          // gap di superficie sopra ogni segmento tranne l'ultimo
                          const hVisibile = k < visibili.length - 1 ? Math.max(0, h - SPAZIO) : h;
                          const segmento =
                            k === visibili.length - 1 ? (
                              <path
                                key={f.chiave}
                                d={colonnaArrotondata(x, top, colonna, hVisibile)}
                                fill={f.colore}
                                fillOpacity={c.completo ? 1 : 0.4}
                              />
                            ) : (
                              <rect
                                key={f.chiave}
                                x={x}
                                y={top + (h - hVisibile)}
                                width={colonna}
                                height={hVisibile}
                                fill={f.colore}
                                fillOpacity={c.completo ? 1 : 0.4}
                              />
                            );
                          base = top;
                          return segmento;
                        })}
                      {(i % ogni === (slot.length - 1) % ogni || s.mese === 1) && (
                        <text
                          x={cx}
                          y={ALTEZZA - MARGINE.basso + 14}
                          textAnchor="middle"
                          fontSize={11}
                          fill="var(--bs-secondary-color)">
                          {NOMI_MESI[s.mese - 1].slice(0, 3)}
                        </text>
                      )}
                      {s.mese === 1 && (
                        <text
                          x={cx}
                          y={ALTEZZA - MARGINE.basso + 26}
                          textAnchor="middle"
                          fontSize={10}
                          fill="var(--bs-secondary-color)">
                          {s.anno}
                        </text>
                      )}
                      {/* area di hover: tutta la banda, più grande della colonna */}
                      <rect
                        x={MARGINE.sinistra + banda * i}
                        y={MARGINE.alto}
                        width={banda}
                        height={altezzaPlot}
                        fill="transparent"
                        onMouseEnter={() => setAttivo(i)}
                      />
                    </g>
                  );
                })}

                {/* affiancate: etichette accanto al gruppo dell'ultimo mese, all'altezza della cima di ogni barra,
                    distanziate quando si sovrapporrebbero */}
                {affiancate &&
                  ultimaColonna?.consumo &&
                  (() => {
                    const x = MARGINE.sinistra + banda * (slot.length - 1) + banda / 2 + gruppo / 2 + 4;
                    const etichette = FASCE.map(f => ({
                      f,
                      yy: y(ultimaColonna.consumo?.[f.chiave] ?? 0),
                    })).sort((a, b) => a.yy - b.yy);
                    for (let k = 1; k < etichette.length; k++) {
                      etichette[k].yy = Math.max(etichette[k].yy, etichette[k - 1].yy + 12);
                    }
                    return etichette.map(({ f, yy }) => (
                      <text key={f.chiave} x={x} y={yy} dy="0.32em" fontSize={11} fill="var(--bs-secondary-color)">
                        {f.nome}
                      </text>
                    ));
                  })()}

                {/* impilate: etichette dirette accanto all'ultima colonna, se il segmento è abbastanza alto */}
                {!affiancate &&
                  ultimaColonna?.consumo &&
                  (() => {
                    const x = MARGINE.sinistra + banda * (slot.length - 1) + banda / 2 + colonna / 2 + 4;
                    let base = 0;
                    return FASCE.map(f => {
                      const v = ultimaColonna.consumo?.[f.chiave] ?? 0;
                      const centro = y(base + v / 2);
                      const alto = (v / max) * altezzaPlot;
                      base += v;
                      return alto >= 12 ? (
                        <text
                          key={f.chiave}
                          x={x}
                          y={centro}
                          dy="0.32em"
                          fontSize={11}
                          fill="var(--bs-secondary-color)">
                          {f.nome}
                        </text>
                      ) : null;
                    });
                  })()}
              </svg>

              {selezionato && attivo !== null && (
                <div
                  className="position-absolute bg-body border rounded-2 shadow-sm small p-2"
                  style={{
                    top: 4,
                    left: Math.min(Math.max(0, MARGINE.sinistra + banda * attivo + banda / 2 + 14), larghezza - 210),
                    width: 196,
                    pointerEvents: "none",
                  }}>
                  <div className="fw-semibold mb-1">{nomeMese(selezionato)}</div>
                  {selezionato.consumo ? (
                    <>
                      {[...FASCE].reverse().map(f => (
                        <div key={f.chiave} className="d-flex align-items-center gap-1">
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 2,
                              background: f.colore,
                              display: "inline-block",
                            }}
                          />
                          {f.nome}
                          <span className="ms-auto">{formatNumero(selezionato.consumo?.[f.chiave], 0)} kWh</span>
                        </div>
                      ))}
                      <div className="d-flex border-top mt-1 pt-1 fw-semibold">
                        Totale
                        <span className="ms-auto">{formatNumero(selezionato.consumo.totale, 0)} kWh</span>
                      </div>
                      <div className="text-body-secondary mt-1">
                        letture {formatData(selezionato.consumo.dal)} - {formatData(selezionato.consumo.al)}
                      </div>
                      {selezionato.consumo.fornitureTotali > 1 && (
                        <div className="text-body-secondary">
                          POD: {selezionato.consumo.forniture} / {selezionato.consumo.fornitureTotali}
                        </div>
                      )}
                      {!selezionato.consumo.completo && <div className="text-warning">non copre tutto il mese</div>}
                    </>
                  ) : (
                    <div className="text-body-secondary">letture insufficienti</div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConsumiMensili;
