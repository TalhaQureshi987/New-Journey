import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.loading = false;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    updateUserSuccess: (state, action) => {
      const updatedUser = action.payload;
      state.users = state.users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      );
      state.selectedUser = updatedUser;
    },
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      state.users = state.users.map(user =>
        user._id === userId ? { ...user, status } : user
      );
    }
  }
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  setSelectedUser,
  clearSelectedUser,
  updateUserSuccess,
  updateUserStatus
} = userSlice.actions;

export const selectUsers = (state) => state.users.users;
export const selectSelectedUser = (state) => state.users.selectedUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

export default userSlice.reducer; 