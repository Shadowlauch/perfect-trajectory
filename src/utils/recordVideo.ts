import {Application} from 'pixi.js';

export const createMediaRecorder = (app: Application) => {
  const videoStream = app.view.captureStream(30);
  const mediaRecorder = new MediaRecorder(videoStream);

  let chunks: BlobPart[] = [];
  mediaRecorder.ondataavailable = function(e) {
    chunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { 'type' : 'video/mp4' });
    chunks = [];
    const link = document.createElement("a");
    link.download = 'video.mp4';
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  mediaRecorder.ondataavailable = function(e) {
    chunks.push(e.data);
  };

  return mediaRecorder;
}
