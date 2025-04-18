// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import authReducer from './auth/authSlice';
import { api } from './service'; // RTK Query API slice

// Combine all reducers into one rootReducer
const rootReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

// Define the root state type
export type RootState = ReturnType<typeof rootReducer>;

// Setup redux-persist for the auth slice
const persistConfig: PersistConfig<RootState> = {
  key: 'auth',
  storage,
  whitelist: ['auth'], // Only persist the auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist compatibility
    }).concat(api.middleware),
});

// Create the persistor for redux-persist
export const persistor = persistStore(store);

// Export types for use in hooks
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
