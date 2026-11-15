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
  SHOW_NUOVA_FORNITURA_CLIENTE_MODAL,
  SHOW_NUOVA_FORNITURA_DATI_MODAL,
  SHOW_DELETE_FORNITURA_MODAL,
  HIDE_DELETE_FORNITURA_MODAL,
  SHOW_ADD_OFFERTA_MODAL,
  HIDE_ADD_OFFERTA_MODAL,
  SHOW_NUOVA_OFFERTA_FORNITURA_MODAL,
  SHOW_CAMBIA_OFFERTA_MODAL,
  HIDE_CAMBIA_OFFERTA_MODAL,
  SHOW_DELETE_OFFERTA_MODAL,
  HIDE_DELETE_OFFERTA_MODAL,
  SHOW_ADD_ALTRA_PARTITA_MODAL,
  HIDE_ADD_ALTRA_PARTITA_MODAL,
  SHOW_DELETE_ALTRA_PARTITA_MODAL,
  HIDE_DELETE_ALTRA_PARTITA_MODAL,
} from "../actions";

export interface ModalState {
  showUploadModal: boolean;
  showAddLetturaModal: boolean;
  modLetturaId: number | null;
  showDeleteLetturaModal: boolean;
  deleteLetturaId: number | null;
  showAddOneriModal: boolean;
  modOneriId: number | null;
  showDeleteOneriModal: boolean;
  deleteOneriId: number | null;
  showAddDispacciamentoModal: boolean;
  modDispacciamentoId: number | null;
  showDeleteDispacciamentoModal: boolean;
  deleteDispacciamentoId: number | null;
  showAddClienteModal: boolean;
  modClienteId: number | null;
  showDeleteClienteModal: boolean;
  deleteClienteId: number | null;
  showAddFornituraModal: boolean;
  modFornituraId: string | null;
  /** cliente preselezionato nella nuova fornitura */
  nuovaFornituraClienteId: number | null;
  /** campi precompilati della nuova fornitura */
  nuovaFornituraDati: Record<string, string | number> | null;
  showDeleteFornituraModal: boolean;
  deleteFornituraId: string | null;
  showAddOffertaModal: boolean;
  modOffertaId: number | null;
  /** pod a cui associare l'offerta appena creata */
  offertaPerPod: string | null;
  /** fornitura di cui cambiare l'offerta */
  cambiaOffertaPod: string | null;
  showDeleteOffertaModal: boolean;
  deleteOffertaId: number | null;
  showAddAltraPartitaModal: boolean;
  modAltraPartitaId: number | null;
  showDeleteAltraPartitaModal: boolean;
  deleteAltraPartitaId: number | null;
}

interface ModalAction {
  type: string;
  payload?: unknown;
}

const initialState: ModalState = {
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
  nuovaFornituraClienteId: null,
  nuovaFornituraDati: null,
  showDeleteFornituraModal: false,
  deleteFornituraId: null,
  showAddOffertaModal: false,
  modOffertaId: null,
  offertaPerPod: null,
  cambiaOffertaPod: null,
  showDeleteOffertaModal: false,
  deleteOffertaId: null,
  showAddAltraPartitaModal: false,
  modAltraPartitaId: null,
  showDeleteAltraPartitaModal: false,
  deleteAltraPartitaId: null,
};

const modalReducer = (state = initialState, action: ModalAction): ModalState => {
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
        modLetturaId: action.payload as number,
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
        deleteLetturaId: action.payload as number,
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
        modOneriId: action.payload as number,
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
        deleteOneriId: action.payload as number,
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
        modDispacciamentoId: action.payload as number,
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
        deleteDispacciamentoId: action.payload as number,
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
        modClienteId: action.payload as number,
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
        deleteClienteId: action.payload as number,
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
        modFornituraId: action.payload as string,
        nuovaFornituraClienteId: null,
        nuovaFornituraDati: null,
      };
    case SHOW_NUOVA_FORNITURA_CLIENTE_MODAL:
      return {
        ...state,
        showAddFornituraModal: true,
        modFornituraId: null,
        nuovaFornituraClienteId: action.payload as number,
        nuovaFornituraDati: null,
      };
    case SHOW_NUOVA_FORNITURA_DATI_MODAL:
      return {
        ...state,
        showAddFornituraModal: true,
        modFornituraId: null,
        nuovaFornituraClienteId: null,
        nuovaFornituraDati: action.payload as Record<string, string | number>,
      };
    case HIDE_ADD_FORNITURA_MODAL:
      return {
        ...state,
        showAddFornituraModal: false,
        modFornituraId: null,
        nuovaFornituraClienteId: null,
        nuovaFornituraDati: null,
      };
    case SHOW_DELETE_FORNITURA_MODAL:
      return {
        ...state,
        showDeleteFornituraModal: true,
        deleteFornituraId: action.payload as string,
      };
    case HIDE_DELETE_FORNITURA_MODAL:
      return {
        ...state,
        showDeleteFornituraModal: false,
        deleteFornituraId: null,
      };
    case SHOW_ADD_OFFERTA_MODAL:
      return {
        ...state,
        showAddOffertaModal: true,
        modOffertaId: action.payload as number,
        offertaPerPod: null,
      };
    case SHOW_CAMBIA_OFFERTA_MODAL:
      return {
        ...state,
        cambiaOffertaPod: action.payload as string,
      };
    case HIDE_CAMBIA_OFFERTA_MODAL:
      return {
        ...state,
        cambiaOffertaPod: null,
      };
    case SHOW_NUOVA_OFFERTA_FORNITURA_MODAL:
      return {
        ...state,
        showAddOffertaModal: true,
        modOffertaId: null,
        offertaPerPod: action.payload as string,
      };
    case HIDE_ADD_OFFERTA_MODAL:
      return {
        ...state,
        showAddOffertaModal: false,
        modOffertaId: null,
        offertaPerPod: null,
      };
    case SHOW_DELETE_OFFERTA_MODAL:
      return {
        ...state,
        showDeleteOffertaModal: true,
        deleteOffertaId: action.payload as number,
      };
    case HIDE_DELETE_OFFERTA_MODAL:
      return {
        ...state,
        showDeleteOffertaModal: false,
        deleteOffertaId: null,
      };
    case SHOW_ADD_ALTRA_PARTITA_MODAL:
      return {
        ...state,
        showAddAltraPartitaModal: true,
        modAltraPartitaId: action.payload as number,
      };
    case HIDE_ADD_ALTRA_PARTITA_MODAL:
      return {
        ...state,
        showAddAltraPartitaModal: false,
        modAltraPartitaId: null,
      };
    case SHOW_DELETE_ALTRA_PARTITA_MODAL:
      return {
        ...state,
        showDeleteAltraPartitaModal: true,
        deleteAltraPartitaId: action.payload as number,
      };
    case HIDE_DELETE_ALTRA_PARTITA_MODAL:
      return {
        ...state,
        showDeleteAltraPartitaModal: false,
        deleteAltraPartitaId: null,
      };

    default:
      return state;
  }
};

export default modalReducer;
