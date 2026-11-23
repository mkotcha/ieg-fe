import { SET_ERROR, SET_LOADING, SET_RUOLO, SET_TOKEN, SET_USER, UNSET_TOKEN } from "../actions";
import type { Ruolo } from "../../types";

export interface AuthState {
  token: string | null;
  user: unknown;
  /** ADMIN può tutto, USER è in sola lettura; null finché non è noto */
  ruolo: Ruolo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: unknown;
}

interface AuthAction {
  type: string;
  payload?: unknown;
}

const initialState: AuthState = {
  token: null,
  user: null,
  ruolo: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload as string,
        isAuthenticated: true,
        isLoading: false,
      };
    case UNSET_TOKEN:
      return {
        ...state,
        token: null,
        ruolo: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case SET_RUOLO:
      return {
        ...state,
        ruolo: action.payload as Ruolo | null,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload as boolean,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
