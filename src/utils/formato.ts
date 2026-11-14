/** Importo in euro con due decimali alla italiana; stringa vuota se assente. */
export const formatEuro = (n: number | null | undefined) =>
  n === null || n === undefined || isNaN(n)
    ? ""
    : n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Numero alla italiana con al massimo `decimali` cifre decimali; stringa vuota se assente. */
export const formatNumero = (n: number | null | undefined, decimali = 2) =>
  n === null || n === undefined || isNaN(n) ? "" : n.toLocaleString("it-IT", { maximumFractionDigits: decimali });

export const NOMI_MESI = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];
