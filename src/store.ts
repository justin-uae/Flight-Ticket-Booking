import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import currencyReducer from './slices/currencySlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        currency: currencyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;