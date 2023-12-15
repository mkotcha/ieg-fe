import axios from "axios";

export const SET_TOKEN = "SET_TOKEN";
export const UNSET_TOKEN = "UNSET_TOKEN";
export const SET_USER = "SET_USER";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const SHOW_UPLOAD_MODAL = "SHOW_UPLOAD_MODAL";
export const HIDE_UPLOAD_MODAL = "HIDE_UPLOAD_MODAL";
export const SHOW_ADD_LETTURA_MODAL = "SHOW_ADD_LETTURA_MODAL";
export const HIDE_ADD_LETTURA_MODAL = "HIDE_ADD_LETTURA_MODAL";
export const SHOW_DELETE_LETTURA_MODAL = "SHOW_DELETE_LETTURA_MODAL";
export const HIDE_DELETE_LETTURA_MODAL = "HIDE_DELETE_LETTURA_MODAL";

export const setTokenAction = token => ({ type: SET_TOKEN, payload: token });
export const unsetTokenAction = () => ({ type: UNSET_TOKEN });
export const showUploadModalAction = () => ({ type: SHOW_UPLOAD_MODAL });
export const hideUploadModalAction = () => ({ type: HIDE_UPLOAD_MODAL });
export const showAddLetturaModalAction = id => ({ type: SHOW_ADD_LETTURA_MODAL, payload: id });
export const hideAddLetturaModalAction = () => ({ type: HIDE_ADD_LETTURA_MODAL });
export const showDeleteLetturaModalAction = id => ({ type: SHOW_DELETE_LETTURA_MODAL, payload: id });
export const hideDeleteLetturaModalAction = () => ({ type: HIDE_DELETE_LETTURA_MODAL });

export const loginAction = (username, password) => {
  return async dispatch => {
    const url = `${import.meta.env.VITE_REACT_APP_URL}/auth/login`;
    const response = await axios.post(url, { username, password });
    const token = response.data.accessToken;
    dispatch(setTokenAction(token));
  };
};
