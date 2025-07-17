import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    companies: [],
    singleCompany: null,
    error: null,
    loading: false,
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setCompanies: (state, action) => {
            state.companies = action.payload;
        },
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setCompanies, setSingleCompany, setError } = companySlice.actions;
export default companySlice.reducer;