import React, { useEffect, useState } from 'react';
import { loadModels } from './utils/faceUtils';
import WebcamFeed from './components/WebcamFeed';
import ImageUpload from './components/ImageUpload';
import './App.css';

const App: React.FC = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    loadModels()
      .then(() => setModelsLoaded(true))
      .catch(err => console.error('❌ failed to load models', err));
  }, []);

  if (!modelsLoaded) {
    return (
      <div className="App-header">
        <div className="spinner" />
        <p>Loading models…</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Webcam Facial Recognition</h1>
      </header>
      <main style={{ padding: '20px', textAlign: 'center' }}>
        <ImageUpload />
        <WebcamFeed />
      </main>
    </div>
  );
};

export default App;
