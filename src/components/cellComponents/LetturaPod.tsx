import type { ICellRendererParams } from "ag-grid-community";
import { Link } from "react-router-dom";
import type { Lettura } from "../../types";
import PulsantiLettura from "./PulsantiLettura";

/** POD della lettura con i pulsanti attiva/disattiva, modifica ed elimina. */
const LetturaPod = (params: ICellRendererParams<Lettura>) => (
  <div className="d-flex ">
    <div className="me-auto ">
      <Link to={`/fornitura/${params.data?.fornitura?.id}`} className="text-decoration-none text-reset">
        {params.data?.fornitura?.id}
      </Link>
    </div>
    <PulsantiLettura lettura={params.data} ricarica={(params.context as { ricarica?: () => void } | undefined)?.ricarica} />
  </div>
);

export default LetturaPod;
