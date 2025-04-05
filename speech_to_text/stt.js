// Set up basic variables for app
const record = document.querySelector(".record");
const stop = document.querySelector(".stop");
const soundClips = document.querySelector(".sound-clips");

// Disable stop button while not recording
stop.disabled = true;

// Main block for doing the audio recording
if (navigator.mediaDevices.getUserMedia) {
  console.log("The mediaDevices.getUserMedia() method is supported.");

  const constraints = { audio: true };
  let chunks = [];

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    const mediaRecorder = new MediaRecorder(stream);

    record.onclick = () => {
      mediaRecorder.start();
      record.disabled = true;
      stop.disabled = false;
    };

    stop.onclick = () => {
      mediaRecorder.stop();
      record.disabled = false;
      stop.disabled = true;
    };

    mediaRecorder.onstop = () => {
      const audio = document.createElement("audio");
      audio.setAttribute("controls", "");
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
      chunks = [];
      audio.src = window.URL.createObjectURL(blob);
      soundClips.appendChild(audio);
    };

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
  }).catch((err) => {
    console.log("The following error occurred: " + err);
  });
} else {
  console.log("MediaDevices.getUserMedia() not supported on your browser!");
}