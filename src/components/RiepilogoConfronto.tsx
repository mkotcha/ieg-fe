import { Col, Row } from "react-bootstrap";
import { formatEuro } from "../utils/formato";

interface Props {
  totaleNostro: number;
  totaleFornitore: number;
  margine: number;
  differenzaPassanti: number;
  anomalie: number;
  /** etichetta del contatore anomalie, es. "fatture con anomalie" */
  etichettaAnomalie: string;
  costiIeg?: number;
}

/** Riquadri con i totali del confronto con il fornitore (home e dettaglio fattura). */
const RiepilogoConfronto = ({
  totaleNostro,
  totaleFornitore,
  margine,
  differenzaPassanti,
  anomalie,
  etichettaAnomalie,
  costiIeg,
}: Props) => {
  // margine in percentuale sul costo del fornitore
  const percentuale = totaleFornitore ? (margine / totaleFornitore) * 100 : null;
  const riquadri = [
    { titolo: "Nostro (imponibile)", valore: `${formatEuro(totaleNostro)} €` },
    { titolo: "Fornitore", valore: `${formatEuro(totaleFornitore)} €` },
    {
      titolo: "Margine",
      valore: `${formatEuro(margine)} €`,
      nota: percentuale === null ? undefined : `${percentuale.toLocaleString("it-IT", { maximumFractionDigits: 1 })}% sul fornitore`,
      classe: margine < 0 ? "text-danger" : "text-success",
    },
    {
      titolo: "Differenza voci passanti",
      valore: `${formatEuro(differenzaPassanti)} €`,
      nota: "dovrebbe essere ~0",
      classe: Math.abs(differenzaPassanti) > 1 ? "text-warning" : undefined,
    },
    {
      titolo: etichettaAnomalie,
      valore: anomalie.toLocaleString("it-IT"),
      classe: anomalie > 0 ? "text-warning" : "text-success",
    },
    ...(costiIeg === undefined
      ? []
      : [{ titolo: "Costi IEG", valore: `${formatEuro(costiIeg)} €`, nota: "prepayment, mora, bollo... non per cliente" }]),
  ];

  return (
    <Row xs={2} md={3} xl={6} className="g-2">
      {riquadri.map(r => (
        <Col key={r.titolo}>
          <div className="border rounded-3 p-2 h-100 bg-body">
            <div className="small text-body-secondary">{r.titolo}</div>
            <div className={`fs-5 fw-semibold ${r.classe ?? ""}`}>{r.valore}</div>
            {r.nota && <div className="small text-body-secondary">{r.nota}</div>}
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default RiepilogoConfronto;
