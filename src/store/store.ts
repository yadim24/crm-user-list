import { configureStore } from '@reduxjs/toolkit';
import { IS_DEV } from 'shared/constants';
import { TOASTER_SLICE } from './constants';
import { toastReducer } from './toastSlice';

export const store = configureStore({
  devTools: IS_DEV,
  reducer: {
    [TOASTER_SLICE]: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
