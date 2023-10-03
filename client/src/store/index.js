import { configureStore } from '@reduxjs/toolkit';

import loginSlice from './slice/login';

const store = configureStore({
  reducer: { login: loginSlice.reducer },
});

export default store;
