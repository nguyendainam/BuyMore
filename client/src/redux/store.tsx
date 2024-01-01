// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import systemReducer from "./Slice/systemSlice";
import useReduder from "./Slice/userSlice";
import productReducer from "./Slice/productSlice";

const persistConfig = {
  key: "shop/system",
  storage,
};

const systemConfig = {
  ...persistConfig,
  whitelist: ["language"],
};
const persistConfigUser = {
  key: "shop/user",
  storage,
};

const userConfig = {
  ...persistConfigUser,
  whitelist: ["accessToken", "isLogin"],
};

const persistConfigProduct = {
  key: "shop/product",
  storage,
};

const productConfig = {
  ...persistConfigProduct,
};

const systemReducers = persistReducer(systemConfig, systemReducer);
const useReducers = persistReducer(userConfig, useReduder);
const productReducers = persistReducer(productConfig, productReducer);
export const store = configureStore({
  reducer: {
    system: systemReducers,
    user: useReducers,
    product: productReducers,
  },
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;

export const persistor = persistStore(store);
