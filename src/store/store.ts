import { configureStore } from '@reduxjs/toolkit';
import flightReducer from '../slices//flightSlice';
import destinationReducer from '../slices//destinationSlice';

export const store = configureStore({
    reducer: {
        flights: flightReducer,
        destinations: destinationReducer,

    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;