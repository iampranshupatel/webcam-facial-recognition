import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as faceapi from 'face-api.js';
import { detectFaces } from '../utils/faceUtils';
import { setDetections } from '../store/faceSlice';
import { RootState } from '../store';
import './WebcamFeed'; // if you have any shared styles

const ImageUpload: React.FC = () => {
  const dispatch = useDispatch();
  const results = useSelector((s: RootState) => s.face.results);

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imgSrc) URL.revokeObjectURL(imgSrc);

    const url = URL.createObjectURL(file);
    setImgSrc(url);

    const img = await faceapi.bufferToImage(file);
    await img.decode();
    const detections = await detectFaces(img);
    dispatch(setDetections(detections));
  };

  useEffect(() => {
    if (!imgSrc || !canvasRef.current || !imageRef.current) return;

    const imgEl = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const displayW = imgEl.clientWidth;
    const displayH = imgEl.clientHeight;
    canvas.width = displayW;
    canvas.height = displayH;

    const scaleX = displayW / imgEl.naturalWidth;
    const scaleY = displayH / imgEl.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    results.forEach(r => {
      const x = r.box.x * scaleX;
      const y = r.box.y * scaleY;
      const w = r.box.width * scaleX;
      const h = r.box.height * scaleY;

      // dynamic line width & rounded rect
      const lineWidth = Math.max(2, canvas.width * 0.002);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = '#00ff00';
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

      // semi-transparent text background & label
      const fontSize = Math.max(12, canvas.width * 0.02);
      ctx.font = `${fontSize}px sans-serif`;
      const text = `${r.gender} ${r.age.toFixed(0)}`;
      const textW = ctx.measureText(text).width;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(x, y - fontSize - 6, textW + 10, fontSize + 6);
      ctx.fillStyle = '#00ff00';
      ctx.fillText(text, x + 5, y - 5);
    });
  }, [results, imgSrc]);

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="control-button"
      />
      {imgSrc && (
        <div className="media-container">
          <img ref={imageRef} src={imgSrc} alt="upload preview" />
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
