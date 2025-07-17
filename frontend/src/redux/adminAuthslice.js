import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.admin = action.payload;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.admin = null;
            state.error = action.payload;
        },
        logout: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.admin = null;
            state.error = null;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout } = adminAuthSlice.actions;

// Selectors
export const selectAdmin = (state) => state.adminAuth.admin;
export const selectIsAuthenticated = (state) => state.adminAuth.isAuthenticated;
export const selectLoading = (state) => state.adminAuth.loading;
export const selectError = (state) => state.adminAuth.error;

export default adminAuthSlice.reducer;