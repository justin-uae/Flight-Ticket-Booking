import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFlightById, fetchFlights, type Flight } from '../services/shopifyService';

interface FlightState {
    flights: Flight[];
    selectedFlight: Flight | null;
    loading: boolean;
    error: string | null;
    searchParams: {
        from: string;
        to: string;
        date: string;
        passengers: string;
    } | null;
}

const initialState: FlightState = {
    flights: [],
    selectedFlight: null,
    loading: false,
    error: null,
    searchParams: null,
};

// Async thunk to search flights
export const searchFlights = createAsyncThunk(
    'flights/searchFlights',
    async (params: { from: string; to: string; date: string; passengers: string }) => {
        const flights = await fetchFlights(params.from, params.to);
        return { flights, searchParams: params };
    }
);

// Async thunk to get flight by ID
export const getFlightById = createAsyncThunk(
    'flights/getFlightById',
    async (id: string) => {
        const flight = await fetchFlightById(id);
        return flight;
    }
);

const flightSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        clearFlights: (state) => {
            state.flights = [];
            state.error = null;
        },
        clearSelectedFlight: (state) => {
            state.selectedFlight = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Search flights
            .addCase(searchFlights.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchFlights.fulfilled, (state, action) => {
                state.loading = false;
                state.flights = action.payload.flights;
                state.searchParams = action.payload.searchParams;
            })
            .addCase(searchFlights.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch flights';
            })
            // Get flight by ID
            .addCase(getFlightById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFlightById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFlight = action.payload;
            })
            .addCase(getFlightById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch flight';
            });
    },
});

export const { clearFlights, clearSelectedFlight } = flightSlice.actions;
export default flightSlice.reducer;