import { xhrRequest } from "./common";
// import * as faceapi from '@vladmandic/face-api';

export async function loadTinyModels() {
  const ab = await xhrRequest("/static/params");
  await faceapi.nets.tinyFaceDetector.load(new Float32Array(ab));
  console.log('load model finished!');
}

export async function detectAllFace(picNode: HTMLImageElement) {
  const optTiny = new faceapi.TinyFaceDetectorOptions();
  return faceapi.detectSingleFace(picNode, optTiny);
}
