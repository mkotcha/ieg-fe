import {
  HIDE_ADD_LETTURA_MODAL,
  HIDE_DELETE_LETTURA_MODAL,
  HIDE_UPLOAD_MODAL,
  SHOW_ADD_LETTURA_MODAL,
  SHOW_DELETE_LETTURA_MODAL,
  SHOW_UPLOAD_MODAL,
} from "../actions";

const initialState = {
  showUploadModal: false,
  showAddLetturaModal: false,
  modLetturaId: null,
  showDeleteLetturaModal: false,
  deleteLetturaId: null,
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_UPLOAD_MODAL:
      return {
        ...state,
        showUploadModal: true,
      };
    case HIDE_UPLOAD_MODAL:
      return {
        ...state,
        showUploadModal: false,
      };
    case SHOW_ADD_LETTURA_MODAL:
      return {
        ...state,
        showAddLetturaModal: true,
        modLetturaId: action.payload,
      };
    case HIDE_ADD_LETTURA_MODAL:
      return {
        ...state,
        showAddLetturaModal: false,
        modLetturaId: null,
      };
    case SHOW_DELETE_LETTURA_MODAL:
      return {
        ...state,
        showDeleteLetturaModal: true,
        deleteLetturaId: action.payload,
      };
    case HIDE_DELETE_LETTURA_MODAL:
      return {
        ...state,
        showDeleteLetturaModal: false,
        deleteLetturaId: null,
      };
    default:
      return state;
  }
};

export default modalReducer;
