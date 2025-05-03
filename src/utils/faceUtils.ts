import * as faceapi from 'face-api.js';
import { FaceResult } from '../store/faceSlice';

export const loadModels = async () => {
  const MODEL_URL = process.env.PUBLIC_URL + '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);
};

export const detectFaces = async (
  input: HTMLVideoElement | HTMLImageElement
): Promise<FaceResult[]> => {
  const detections = await faceapi
    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
    .withAgeAndGender()
    .withFaceExpressions();

  return detections.map(det => ({
    box: det.detection.box,
    age: det.age,
    gender: det.gender,
    expressions: det.expressions,
  }));
};
