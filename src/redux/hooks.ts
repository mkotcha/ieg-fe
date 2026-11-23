import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/** true se l'utente collegato è ADMIN: gli altri (USER) sono in sola lettura e non vedono i pulsanti di modifica. */
export const useIsAdmin = () => useAppSelector(state => state.auth.ruolo === "ADMIN");
