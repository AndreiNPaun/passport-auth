import { createSlice } from '@reduxjs/toolkit';

// Check if is set or set to false
const isLoggedIn = localStorage.getItem('isLoggedIn');
const role = localStorage.getItem('role');

const initialState = { loginCheck: isLoggedIn || false, role: role || false };

const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.loginCheck = action.payload.loginCheck;
      state.role = action.payload.role;
    },
    logout(state) {
      state.loginCheck = false;
      state.role = false;
    },
  },
});

export const loginActions = loginSlice.actions;

export default loginSlice;
