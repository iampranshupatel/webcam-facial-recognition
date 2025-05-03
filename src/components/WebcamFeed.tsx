// src/components/WebcamFeed.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { startStream, stopStream } from '../store/webcamSlice';
import { setDetections } from '../store/faceSlice';
import { detectFaces } from '../utils/faceUtils';
import FaceOverlay from './FaceOverlay';

const WebcamFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isStreaming = useSelector((s: RootState) => s.webcam.isStreaming);

  // Detection loop, starts when video fires `onPlay`
  const runDetection = useCallback(async () => {
    const videoEl = videoRef.current;
    if (videoEl && isStreaming) {
      const results = await detectFaces(videoEl);
      console.log('🔍 webcam detections:', results);
      dispatch(setDetections(results));
      requestAnimationFrame(runDetection);
    }
  }, [dispatch, isStreaming]);

  useEffect(() => {
    let localStream: MediaStream | null = null;

    if (isStreaming && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          localStream = stream;
          const videoEl = videoRef.current!;
          videoEl.srcObject = stream;
          // once metadata is ready, play will fire `onPlay` → runDetection
          videoEl.onloadedmetadata = () => videoEl.play().catch(console.error);
        })
        .catch(err => console.error('⚠️ getUserMedia failed:', err));
    } else {
      // stop stream & clear detections
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(t => t.stop());
        videoRef.current.srcObject = null;
        dispatch(setDetections([]));
      }
    }

    return () => {
      localStream?.getTracks().forEach(t => t.stop());
    };
  }, [isStreaming, dispatch]);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <div className="media-container">
        <video
          ref={videoRef}
          onPlay={runDetection}
          muted
          playsInline
          style={{ backgroundColor: 'black' }} // so the box isn’t transparent before play
        />
        <FaceOverlay videoRef={videoRef} />
      </div>
      <div>
        <button
          className="control-button"
          onClick={() => dispatch(startStream())}
        >
          Start
        </button>
        <button
          className="control-button"
          onClick={() => dispatch(stopStream())}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default WebcamFeed;
