import { configureStore } from '@reduxjs/toolkit';
import flightReducer from '../slices//flightSlice';
import destinationReducer from '../slices//destinationSlice';
import airportReducer from '../slices//airportSlice';

export const store = configureStore({
    reducer: {
        flights: flightReducer,
        destinations: destinationReducer,
        airports: airportReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;