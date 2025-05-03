// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import webcamReducer from './webcamSlice';
import faceReducer   from './faceSlice';   // <-- default import

export const store = configureStore({
  reducer: {
    webcam: webcamReducer,
    face:   faceReducer,
  },
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
