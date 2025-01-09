import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import userReducer from './redux/user/userSlice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux';
import { FLUSH, persistReducer, persistStore, PAUSE, PERSIST, REGISTER, PURGE, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';


const rootReducer = combineReducers({
  user: userReducer
})
const persistConfig = {
  key: "root",
  storage,
  version: 1
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
          <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)

