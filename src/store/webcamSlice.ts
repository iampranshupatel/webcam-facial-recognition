import { createSlice } from '@reduxjs/toolkit';

interface WebcamState { isStreaming: boolean; }
const initialState: WebcamState = { isStreaming: false };

const webcamSlice = createSlice({
  name: 'webcam',
  initialState,
  reducers: {
    startStream: state => { state.isStreaming = true;  },
    stopStream:  state => { state.isStreaming = false; },
  },
});

export const { startStream, stopStream } = webcamSlice.actions;
export default webcamSlice.reducer;
