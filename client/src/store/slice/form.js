import { createSlice } from '@reduxjs/toolkit';

const initialState = { formCheck: false };

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    open(state, action) {
      state.formCheck = action.payload.formCheck;
    },
    close(state) {
      state.formCheck = false;
    },
  },
});

export const formActions = formSlice.actions;

export default formSlice;
