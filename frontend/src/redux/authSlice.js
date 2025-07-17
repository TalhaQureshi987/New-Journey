import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null
    },
    reducers: {
        // actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.loading = false;
            console.log('Login Success:', state);
        }
    }
});
export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;