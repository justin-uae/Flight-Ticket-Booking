import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAirportData, type AirportData } from '../services/shopifyService';

interface AirportState extends AirportData {
    loading: boolean;
    error: string | null;
}

const initialState: AirportState = {
    uaeAirports: [],
    destinationCities: {},
    bannerImage: undefined,
    loading: false,
    error: null,
};

// Async thunk to fetch airport data
export const getAirportData = createAsyncThunk(
    'airports/getData',
    async () => {
        const data = await fetchAirportData();
        return data;
    }
);

const airportSlice = createSlice({
    name: 'airports',
    initialState,
    reducers: {
        clearAirportData: (state) => {
            state.uaeAirports = [];
            state.destinationCities = {};
            state.bannerImage = undefined;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAirportData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAirportData.fulfilled, (state, action) => {
                state.loading = false;
                state.uaeAirports = action.payload.uaeAirports;
                state.destinationCities = action.payload.destinationCities;
                state.bannerImage = action.payload.bannerImage;
            })
            .addCase(getAirportData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch airport data';
            });
    },
});

export const { clearAirportData } = airportSlice.actions;
export default airportSlice.reducer;