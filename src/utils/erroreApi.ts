import axios from "axios";

/** Messaggio leggibile da un errore axios: errorsList/message del backend, o 403 per i permessi ADMIN. */
export const erroreApi = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) return "Operazione riservata agli amministratori";
    const data = error.response?.data as { message?: string; errorsList?: string[] } | undefined;
    if (data?.errorsList?.length) return data.errorsList.join(", ");
    if (data?.message) return data.message;
  }
  return fallback;
};
