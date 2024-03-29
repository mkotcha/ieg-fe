import {
  HIDE_ADD_LETTURA_MODAL,
  HIDE_DELETE_LETTURA_MODAL,
  HIDE_UPLOAD_MODAL,
  SHOW_ADD_LETTURA_MODAL,
  SHOW_DELETE_LETTURA_MODAL,
  SHOW_UPLOAD_MODAL,
  HIDE_ADD_ONERI_MODAL,
  HIDE_DELETE_ONERI_MODAL,
  SHOW_ADD_ONERI_MODAL,
  SHOW_DELETE_ONERI_MODAL,
  HIDE_ADD_DISPACCIAMENTO_MODAL,
  HIDE_DELETE_DISPACCIAMENTO_MODAL,
  SHOW_ADD_DISPACCIAMENTO_MODAL,
  SHOW_DELETE_DISPACCIAMENTO_MODAL,
SHOW_ADD_CLIENTE_MODAL,
HIDE_ADD_CLIENTE_MODAL,
SHOW_DELETE_CLIENTE_MODAL,
HIDE_DELETE_CLIENTE_MODAL,
SHOW_ADD_FORNITURA_MODAL,
HIDE_ADD_FORNITURA_MODAL,
SHOW_DELETE_FORNITURA_MODAL,
HIDE_DELETE_FORNITURA_MODAL,
} from "../actions";

const initialState = {
  showUploadModal: false,
  showAddLetturaModal: false,
  modLetturaId: null,
  showDeleteLetturaModal: false,
  deleteLetturaId: null,
  showAddOneriModal: false,
  modOneriId: null,
  showDeleteOneriModal: false,
  deleteOneriId: null,
  showAddDispacciamentoModal: false,
  modDispacciamentoId: null,
  showDeleteDispacciamentoModal: false,
  deleteDispacciamentoId: null,
  showAddClienteModal: false,
  modClienteId: null,
  showDeleteClienteModal: false,
  deleteClienteId: null,
  showAddFornituraModal: false,
  modFornituraId: null,
  showDeleteFornituraModal: false,
  deleteFornituraId: null,
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

    case SHOW_ADD_ONERI_MODAL:
      return {
        ...state,
        showAddOneriModal: true,
        modOneriId: action.payload,
      };
    case HIDE_ADD_ONERI_MODAL:
      return {
        ...state,
        showAddOneriModal: false,
        modOneriId: null,
      };
    case SHOW_DELETE_ONERI_MODAL:
      return {
        ...state,
        showDeleteOneriModal: true,
        deleteOneriId: action.payload,
      };
    case HIDE_DELETE_ONERI_MODAL:
      return {
        ...state,
        showDeleteOneriModal: false,
        deleteOneriId: null,
      };
    case SHOW_ADD_DISPACCIAMENTO_MODAL:
      return {
        ...state,
        showAddDispacciamentoModal: true,
        modDispacciamentoId: action.payload,
      };
    case HIDE_ADD_DISPACCIAMENTO_MODAL:
      return {
        ...state,
        showAddDispacciamentoModal: false,
        modDispacciamentoId: null,
      };
    case SHOW_DELETE_DISPACCIAMENTO_MODAL:
      return {
        ...state,
        showDeleteDispacciamentoModal: true,
        deleteDispacciamentoId: action.payload,
      };
    case HIDE_DELETE_DISPACCIAMENTO_MODAL:
      return {
        ...state,
        showDeleteDispacciamentoModal: false,
        deleteDispacciamentoId: null,
      };
    case SHOW_ADD_CLIENTE_MODAL:
      return {
        ...state,
        showAddClienteModal: true,
        modClienteId: action.payload,
      };
    case HIDE_ADD_CLIENTE_MODAL:
      return {
        ...state,
        showAddClienteModal: false,
        modClienteId: null,
      };
    case SHOW_DELETE_CLIENTE_MODAL:
      return {
        ...state,
        showDeleteClienteModal: true,
        deleteClienteId: action.payload,
      };
    case HIDE_DELETE_CLIENTE_MODAL:
      return {
        ...state,
        showDeleteClienteModal: false,
        deleteClienteId: null,
      };
    case SHOW_ADD_FORNITURA_MODAL:
      return {
        ...state,
        showAddFornituraModal: true,
        modFornituraId: action.payload,
      };
    case HIDE_ADD_FORNITURA_MODAL:
      return {
        ...state,
        showAddFornituraModal: false,
        modFornituraId: null,
      };
    case SHOW_DELETE_FORNITURA_MODAL:
      return {
        ...state,
        showDeleteFornituraModal: true,
        deleteFornituraId: action.payload,
      };
    case HIDE_DELETE_FORNITURA_MODAL:
      return {
        ...state,
        showDeleteFornituraModal: false,
        deleteFornituraId: null,
      };

    default:
      return state;
  }
};

export default modalReducer;
