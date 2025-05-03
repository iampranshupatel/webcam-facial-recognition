// src/components/FaceOverlay.tsx
import React, { RefObject, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import type { FaceResult } from '../store/faceSlice';

interface OverlayProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

const FaceOverlay: React.FC<OverlayProps> = ({ videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const results = useSelector((s: RootState) => s.face.results);

  useEffect(() => {
    const canvas = canvasRef.current;
    const videoEl = videoRef.current;
    if (!canvas || !videoEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // match canvas to video display size
    const displayW = videoEl.clientWidth;
    const displayH = videoEl.clientHeight;
    canvas.width  = displayW;
    canvas.height = displayH;

    const scaleX = displayW / videoEl.videoWidth;
    const scaleY = displayH / videoEl.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    results.forEach((r: FaceResult) => {
      const x = r.box.x * scaleX;
      const y = r.box.y * scaleY;
      const w = r.box.width * scaleX;
      const h = r.box.height * scaleY;

      // dynamic border
      const lineWidth = Math.max(2, canvas.width * 0.002);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = '#00ff00';

      // rounded rect
      const radius = 5;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.stroke();

      // text background & label
      const fontSize = Math.max(12, canvas.width * 0.02);
      ctx.font = `${fontSize}px sans-serif`;
      const text = `${r.gender} ${r.age.toFixed(0)}`;
      const textW = ctx.measureText(text).width;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(x, y - fontSize - 6, textW + 10, fontSize + 6);
      ctx.fillStyle = '#00ff00';
      ctx.fillText(text, x + 5, y - 5);
    });
  }, [results, videoRef]);

  return <canvas ref={canvasRef} />;
};

export default FaceOverlay;
