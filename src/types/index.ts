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

export interface LetturaMancante {
  id: string;
  num: number;
}

/** Page di Spring Data: totalElements è in radice (serializzazione PageImpl) o in page (VIA_DTO). */
export interface PagedResponse<T> {
  content: T[];
  totalElements?: number;
  page?: { totalElements: number };
}
