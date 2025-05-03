// src/store/faceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FaceExpressions } from 'face-api.js';

export interface FaceResult {
  box: { x: number; y: number; width: number; height: number };
  age: number;
  gender: string;
  expressions: FaceExpressions;   // now matches face-api.js
}

interface FaceState {
  results: FaceResult[];
}

const initialState: FaceState = {
  results: [],
};

const faceSlice = createSlice({
  name: 'face',
  initialState,
  reducers: {
    setDetections(state, action: PayloadAction<FaceResult[]>) {
      state.results = action.payload;
    },
  },
});

export const { setDetections } = faceSlice.actions;
export default faceSlice.reducer;
