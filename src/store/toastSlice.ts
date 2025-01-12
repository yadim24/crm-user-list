import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TOASTER_SLICE } from './constants';

type AlertType = 'success' | 'error' | 'warning' | 'info';

export type AlertPayloadAction = {
  message: string;
  alertType: AlertType;
};

type ToastState = {
  open: boolean;
  message: string;
  alertType?: AlertType;
};

const initialState: ToastState = {
  open: false,
  message: '',
  alertType: undefined,
};

export const toastSlice = createSlice({
  name: TOASTER_SLICE,
  initialState,
  reducers: {
    openAlert: (draft, action: PayloadAction<AlertPayloadAction>) => {
      draft.open = true;
      draft.message = action.payload.message;
      draft.alertType = action.payload.alertType;
    },
    closeAlert: () => initialState,
  },
  selectors: {
    selectToaster: (state) => state,
  },
});

export const { selectToaster } = toastSlice.selectors;
export const { openAlert, closeAlert } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;
