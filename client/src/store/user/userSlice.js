import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'product',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null
    },
    // Hàm sẽ bắt đối số nhờ dispatch(register()) để truyền đối số cho register qua 3 state dưới đây
    reducers: {
        login: (state, action) => {
            // console.log(action)
            state.isLoggedIn = action.payload.isLoggedIn
            state.current = action.payload.userData
            state.token = action.payload.token
        }
    },
    // extraReducers: (builder) => {
    //     // Use the correct action creators directly
    //     builder.addCase(getNewProducts.pending, (state) => {
    //         state.isLoading = true;
    //     });
    //     builder.addCase(getNewProducts.fulfilled, (state, action) => {
    //         state.isLoading = false;
    //         state.newProducts = action.payload;
    //         state.errorMessage = ''; // Reset errorMessage on success
    //     });
    //     builder.addCase(getNewProducts.rejected, (state, action) => {
    //         state.isLoading = false;
    //         state.errorMessage = action.payload.message;
    //     });
    // }
});
export const { login } = userSlice.actions

export default userSlice.reducer;
