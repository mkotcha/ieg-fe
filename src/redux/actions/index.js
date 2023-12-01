import axios from "axios";

export const SET_TOKEN = "SET_TOKEN";
export const UNSET_TOKEN = "UNSET_TOKEN";
export const SET_USER = "SET_USER";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

export const setTokenAction = token => ({ type: SET_TOKEN, payload: token });
export const unsetTokenAction = () => ({ type: UNSET_TOKEN });

export const loginAction = (username, password) => {
  return async dispatch => {
    const url = `${import.meta.env.VITE_REACT_APP_URL}/auth/login`;
    const response = await axios.post(url, { username, password });
    const token = response.data.accessToken;
    dispatch(setTokenAction(token));
  };
};
