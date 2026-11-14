export type Bta = "TD" | "BTA" | "BTA1" | "BTA2" | "BTA3" | "BTA4" | "BTA5" | "BTA6" | "BTA6C";
export type CodiceDistributore = "EDIST" | "A2A";
export type Fatturazione = "MENSILE" | "BIMESTRALE";
export type TipoContatore = "ORARIO" | "FASCIA" | "MONORARIO";
export type TipoPrelievo = "BT" | "MT" | "AT";
export type TipoLettura = "AUTOLETTURA" | "CAMBIO" | "REALE" | "RETTIFICA" | "STIMA";
export type TipoDato = "R" | "S";
export type Raccolta = "P" | "T";
export type Validato = "S" | "N";

export interface Cliente {
  id: number;
  ragioneSociale: string;
  pIva: string;
  cf: string;
  indirizzo: string;
  cap: string;
  provincia: string;
  comune: string;
  telefono: string;
  email: string;
  /** isActive lato backend, serializzato da Jackson come "active" */
  active?: boolean;
}

export interface Fornitura {
  id: string; // POD
  cliente: Cliente;
  bta: Bta;
  codiceDistributore: CodiceDistributore;
  comune: string;
  dataSwitch: string;
  dataSwitchOut: string;
  fatturazione: Fatturazione;
  fornitore: string;
  indirizzo: string;
  iva: number;
  potenzaDisponibile: number;
  potenzaImpegnata: number;
  provincia: string;
  tipoContatore: TipoContatore;
  tipoPrelievo: TipoPrelievo;
  cap: string;
  offerta?: Offerta | null;
  /** € al mese sulla riga "Rettifica oneri di programmazione", negativo = restituzione; null = nessuna */
  rettificaProgrammazione?: number | null;
}

export interface Lettura {
  id: number;
  fornitura: Fornitura;
  dataLettura: string;
  tipoLettura?: TipoLettura;
  tipoContatore: TipoContatore;
  tipoDato: TipoDato;
  raccolta: Raccolta;
  validato: Validato;
  potMax?: number;
  eaF1: number;
  eaF2: number;
  eaF3: number;
  erF1: number;
  erF2: number;
  erF3: number;
  potF1: number;
  potF2: number;
  potF3: number;
  note?: string;
}

export interface Oneri {
  id: number;
  tipo: Bta;
  trimestre: number;
  anno: number;
  qeTud: number;
  qpTdm: number;
  qfTud: number;
  qfMis: number;
  qeArim: number;
  qeAsos: number;
  qeUc3: number;
  qpArim: number;
  qpAsos: number;
  qpOds: number;
  qfArim: number;
  qfAsos: number;
}

export interface Dispacciamento {
  id: number;
  costoAm: number;
  dis: number;
  capacita: number;
  sbilanciamento: number;
  mese: number;
  anno: number;
}

/** Importi restituiti dal backend come stringa (vedi parseFloat in FatturaNumero/Cliente). */
export interface Fattura {
  numeroFattura: string;
  dataFattura: string;
  totaleImponibile: string;
  consumoTot: string;
  totaleImposte: string;
  totaleMateria: string;
  totaleTrasporto: string;
  totaleOneri: string;
  totaleIva: string;
  consumoTotP: string;
  mese: number;
  anno: number;
  fattureSingole?: FatturaSingola[];
}

export type SezioneFattura = "MATERIA" | "TRASPORTO" | "ONERI" | "IMPOSTE" | "ALTRE_PARTITE";
export type GruppoScontrino = "VENDITA" | "RETE" | "FISSA_VENDITA" | "FISSA_RETE" | "POTENZA_RETE";

/** Riga del dettaglio (pagina 3): importo = unitario * quantita; iva è una frazione (0.22), 0 per le partite esenti. */
export interface VoceFatturaSingola {
  id: number;
  codice: string;
  descrizione: string;
  sezione: SezioneFattura;
  gruppoScontrino: GruppoScontrino | null;
  dal: string;
  al: string;
  unita: string;
  unitario: number;
  quantita: number;
  importo: number;
  iva: number;
  ordine: number;
}

/** Fattura di una singola fornitura (POD) dentro una Fattura. */
export interface FatturaSingola {
  id: number;
  fornitura: Fornitura;
  consumoTot: number;
  totaleMateria: number;
  totaleTrasporto: number;
  totaleOneri: number;
  totaleImposte: number;
  totaleImponibile: number;
  totaleIva: number;
  /** tutte le altre partite (le soggette a iva sono anche nell'imponibile) */
  totalePartite: number | null;
  /** imponibile + iva + altre partite esenti iva */
  totaleDaPagare: number | null;
  /** consumo con le perdite */
  consumoTotP?: number | null;
  potenzaPrelevata?: number | null;
  /** prezzo medio €/kWh (spesa per consumi / consumo) */
  spesaMedia?: number | null;
  letturaIniziale?: Lettura | null;
  letturaFinale?: Lettura | null;
  voci: VoceFatturaSingola[];
}

/** Esito per cliente di POST /fatture/genera. */
export interface EsitoFattura {
  clienteId: number;
  ragioneSociale: string;
  numeroFattura: string | null;
  /** totale da pagare; null se la generazione è fallita */
  totale: number | null;
  millisecondi: number;
  errore: string | null;
}

export type TipoOfferta = "PUN" | "FISSO" | "NEW";
export type ModalitaProgrammazione = "OCV" | "CLASSIC";

export interface Offerta {
  id: number;
  nome: string;
  codice: string | null;
  tipo: TipoOfferta | null;
  f1: number | null;
  f2: number | null;
  f3: number | null;
  pun: boolean;
  capacitaMaggiorazione: boolean;
  maggiorazione: number | null;
  hasSpread: boolean;
  spread: number | null;
  ocv: number | null;
  /** come si applica ocv: €/kWh sul consumo con perdite (OCV) o percentuale sulla spesa energia (CLASSIC) */
  modalitaProgrammazione: ModalitaProgrammazione | null;
  ocf: number | null;
  descrizione: string | null;
  dataInizio: string | null;
  dataFine: string | null;
}

/** Importo da addebitare (o accreditare se negativo) su una fornitura nella fattura di un mese. */
export interface AltraPartita {
  id: number;
  fornitura: Fornitura;
  voce: string;
  importo: number;
  /** se true resta fuori dall'imponibile e si somma solo al totale da pagare */
  esenteIva: boolean;
  mese: number;
  anno: number;
}

/** GET /letture/verifica: letture di una fornitura nel periodo della fattura del mese. */
export interface VerificaLetture {
  pod: string;
  clienteId: number;
  ragioneSociale: string;
  /** inizio del periodo della fattura, vedi origineInizio */
  dal: string;
  /** ultimo giorno del mese */
  al: string;
  origineInizio: "FATTURA_PRECEDENTE" | "LETTURA_SWITCH" | "FINE_MESE_PRECEDENTE";
  letture: number;
  primaLettura: string | null;
  ultimaLettura: string | null;
  tipoUltimaLettura: TipoLettura | null;
  /** almeno due letture: la fattura si può calcolare */
  fatturabile: boolean;
  problemi: string[];
}

/** Page di Spring Data: totalElements è in radice (serializzazione PageImpl) o in page (VIA_DTO). */
export interface PagedResponse<T> {
  content: T[];
  totalElements?: number;
  page?: { totalElements: number };
}

/** Bolletta del fornitore all'ingrosso verso IEG, importata dal csv di riepilogo. */
export interface FatturaFornitore {
  id: number;
  numero: string;
  dataEmissione: string | null;
  dataScadenza: string | null;
  nomeFile: string | null;
  dataImport: string;
  righe: number;
  totaleImponibile: number;
}

/** Esito di POST /fatture-fornitore/upload, una per bolletta del file. */
export interface EsitoImportFatturaFornitore {
  numero: string;
  dataEmissione: string | null;
  nomeFile: string;
  /** la bolletta era già stata importata e le sue righe sono state sostituite */
  sostituita: boolean;
  righe: number;
  righeScartate: number;
  totaleImponibile: number;
  podSconosciuti: string[];
  righeNonMappate: number;
}

export type VoceConfronto =
  | "ENERGIA_F1"
  | "ENERGIA_F2"
  | "ENERGIA_F3"
  | "PERDITE_F1"
  | "PERDITE_F2"
  | "PERDITE_F3"
  | "COMMERCIALIZZAZIONE"
  | "DISPACCIAMENTO"
  | "MAGGIORAZIONE_CAPACITA"
  | "QUOTE_FISSE_DISPACCIAMENTO"
  | "DISTRIBUZIONE"
  | "TRASMISSIONE"
  | "QUOTE_FISSE_RETE"
  | "QUOTE_POTENZA_RETE"
  | "UC3"
  | "UC6"
  | "ASOS_ENERGIA"
  | "ASOS_FISSA"
  | "ASOS_POTENZA"
  | "ARIM_ENERGIA"
  | "ARIM_FISSA"
  | "ARIM_POTENZA"
  | "REATTIVA_33"
  | "REATTIVA_75"
  | "REATTIVA_IMMESSA"
  | "ACCISE"
  | "ALTRE_PARTITE"
  | "COSTI_IEG"
  | "NON_MAPPATA";

/** Una voce confrontata: differenze = nostro - fornitore; quantità null dove non hanno senso (quote fisse). */
export interface ConfrontoVoce {
  voce: VoceConfronto;
  descrizione: string;
  /** costo girato al cliente così com'è: nostro e fornitore devono coincidere */
  passante: boolean;
  quantitaNostra: number | null;
  importoNostro: number;
  quantitaFornitore: number | null;
  importoFornitore: number;
  differenzaQuantita: number | null;
  differenzaImporto: number;
  anomala: boolean;
}

export interface ConfrontoFornitura {
  pod: string;
  bta: string | null;
  btaFornitore: string | null;
  potenzaImpegnata: number | null;
  potenzaImpegnataFornitore: number | null;
  bolletteFornitore: string[];
  /** tra le righe del fornitore ci sono ricalcoli (storni e rifatturazioni) */
  conguagli: boolean;
  totaleNostro: number;
  totaleFornitore: number;
  margine: number;
  differenzaPassanti: number;
  anomalie: string[];
  voci: ConfrontoVoce[];
}

/** Confronto di una fattura; forniture è null nel riepilogo del mese. */
export interface ConfrontoFattura {
  numeroFattura: string;
  clienteId: number;
  ragioneSociale: string;
  mese: number;
  anno: number;
  totaleNostro: number;
  totaleFornitore: number;
  margine: number;
  /** somma delle differenze sulle voci passanti: dovrebbe essere ~0 */
  differenzaPassanti: number;
  anomalie: number;
  forniture: ConfrontoFornitura[] | null;
}

export interface PodSenzaFattura {
  pod: string;
  inAnagrafica: boolean;
  importoFornitore: number;
}

/** GET /fatture/confronto?mese=&anno= */
export interface ConfrontoMese {
  mese: number;
  anno: number;
  /** ci sono righe del fornitore per il mese (altrimenti la bolletta non è ancora importata) */
  datiFornitore: boolean;
  totaleNostro: number;
  totaleFornitore: number;
  margine: number;
  differenzaPassanti: number;
  /** costi del fornitore verso IEG non legati a un cliente (prepayment, mora, bollo...) */
  costiIeg: number;
  fatture: ConfrontoFattura[];
  podSenzaFattura: PodSenzaFattura[];
}

export interface TariffaNonMappata {
  codTariffa: string | null;
  nrArticolo: string | null;
  descrizione: string | null;
}

export type TipoLavoro = "GENERAZIONE_FATTURE" | "IMPORT_LETTURE";
export type StatoLavoro = "IN_CORSO" | "COMPLETATO" | "FALLITO";

/** Operazione lunga in background (GET /lavori/{id}): fatti/totale della fase corrente, totale 0 = durata non nota. */
export interface Lavoro<R = unknown> {
  id: string;
  tipo: TipoLavoro;
  descrizione: string;
  inizio: string;
  fine: string | null;
  stato: StatoLavoro;
  fase: string;
  totale: number;
  fatti: number;
  /** errori sui singoli elementi (non interrompono il lavoro) */
  errori: number;
  messaggi: string[];
  /** errore che ha interrotto il lavoro */
  errore: string | null;
  /** esito, presente a lavoro completato */
  risultato: R | null;
  inCorso: boolean;
}

/** Risultato del lavoro IMPORT_LETTURE. */
export interface EsitoImportLetture {
  file: number;
  fileScartati: number;
  inserite: number;
  aggiornate: number;
  switchMantenute: number;
  errori: number;
  podSconosciuti: string[];
}

/** GET /forniture/{pod}/consumi: consumo attivo di un mese per fascia (kWh, senza perdite), dalle letture. */
export interface ConsumoMensile {
  mese: number;
  anno: number;
  f1: number;
  f2: number;
  f3: number;
  totale: number;
  /** lettura di partenza */
  dal: string;
  /** lettura di arrivo */
  al: string;
  /** le letture sono proprio a fine mese precedente e a fine mese (per un cliente: per tutti i pod) */
  completo: boolean;
  /** pod con consumo nel mese (1 per una fornitura) */
  forniture: number;
  /** pod considerati: per un cliente tutti i suoi */
  fornitureTotali: number;
}
