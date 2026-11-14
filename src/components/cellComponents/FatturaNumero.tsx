import type { ICellRendererParams } from "ag-grid-community";
import type { Fattura } from "../../types";
import PulsantiFattura from "./PulsantiFattura";

/** Numero della fattura con i pulsanti confronto con il fornitore, excel e pdf. */
const FatturaNumero = (params: ICellRendererParams<Fattura>) => {
  const numero = params.data?.numeroFattura;
  return (
    <div className="d-flex">
      <div>{numero}</div>
      {numero && <PulsantiFattura numero={numero} />}
    </div>
  );
};

export default FatturaNumero;
