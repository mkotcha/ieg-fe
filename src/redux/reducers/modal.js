import { HIDE_ADD_LETTURA_MODAL, HIDE_UPLOAD_MODAL, SHOW_ADD_LETTURA_MODAL, SHOW_UPLOAD_MODAL } from "../actions";

const initialState = {
  showUploadModal: false,
  showAddLetturaModal: false,
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
      };
    case HIDE_ADD_LETTURA_MODAL:
      return {
        ...state,
        showAddLetturaModal: false,
      };
    default:
      return state;
  }
};

export default modalReducer;
