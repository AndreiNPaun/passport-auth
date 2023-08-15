import { configureStore } from '@reduxjs/toolkit';

import loginSlice from './slice/login';
import formSlice from './slice/form';

const store = configureStore({
  reducer: { login: loginSlice.reducer, form: formSlice.reducer },
});

export default store;
