import { createSlice } from '@reduxjs/toolkit';
import { getNewProducts } from './asyncActions';

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        newProducts: null,
        errorMessage: '',
        isLoading: false // Add isLoading to the initial state
    },
    reducers: {
        // Define other reducers if needed
    },
    extraReducers: (builder) => {
        // Use the correct action creators directly
        builder.addCase(getNewProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getNewProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newProducts = action.payload;
            state.errorMessage = ''; // Reset errorMessage on success
        });
        builder.addCase(getNewProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    }
});

export default productSlice.reducer;
