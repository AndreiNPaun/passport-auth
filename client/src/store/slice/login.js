import { createSlice } from '@reduxjs/toolkit';

// Check if is set or set to false
const isLoggedIn = localStorage.getItem('isLoggedIn');

const initialState = { loginCheck: isLoggedIn || false };

const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.loginCheck = action.payload.loginCheck;
    },
    logout(state) {
      state.loginCheck = false;
    },
  },
});

export const loginActions = loginSlice.actions;

export default loginSlice;
