import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPopularDestinations, type Destination } from '../services/shopifyService';

interface DestinationState {
    destinations: Destination[];
    loading: boolean;
    error: string | null;
}

const initialState: DestinationState = {
    destinations: [],
    loading: false,
    error: null,
};

// Async thunk to fetch popular destinations
export const getPopularDestinations = createAsyncThunk(
    'destinations/getPopular',
    async () => {
        const destinations = await fetchPopularDestinations();
        return destinations;
    }
);

const destinationSlice = createSlice({
    name: 'destinations',
    initialState,
    reducers: {
        clearDestinations: (state) => {
            state.destinations = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPopularDestinations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPopularDestinations.fulfilled, (state, action) => {
                state.loading = false;
                state.destinations = action.payload;
            })
            .addCase(getPopularDestinations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch destinations';
            });
    },
});

export const { clearDestinations } = destinationSlice.actions;
export default destinationSlice.reducer;