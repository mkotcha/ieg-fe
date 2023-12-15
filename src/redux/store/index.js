import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { encryptTransform } from "redux-persist-transform-encrypt";
import authReducer from "../reducers/auth";
import modalReducer from "../reducers/modal";

const persistConfig = {
  key: "root",
  storage,
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_REACT_APP_PERSIST_KEY,
    }),
  ],
};

const mainReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
});

const persistedReducer = persistReducer(persistConfig, mainReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
