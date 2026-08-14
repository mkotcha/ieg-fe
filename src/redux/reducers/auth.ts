import { SET_ERROR, SET_LOADING, SET_TOKEN, SET_USER, UNSET_TOKEN } from "../actions";

export interface AuthState {
  token: string | null;
  user: unknown;
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
        isAuthenticated: false,
        isLoading: false,
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
