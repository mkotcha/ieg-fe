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
  trimestre: number;
  anno: number;
  capacita: number;
  eolico: number;
  costoAm: number;
  dis: number;
  int73: number;
  msd: number;
  sicurezza: number;
  trasmissione: number;
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
}

export interface LetturaMancante {
  id: string;
  num: number;
}

export interface PagedResponse<T> {
  content: T[];
}
