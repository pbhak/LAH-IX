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

    mediaRecorder.onstop = async () => {
      const audio = document.createElement("audio");
      audio.setAttribute("controls", "");
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
      chunks = [];
      audio.src = window.URL.createObjectURL(blob);
      soundClips.appendChild(audio);
      console.log("Blob type:", blob.type);

      const outputFile = new File([blob], 'output.mp3', { type: blob.type });
      console.log("Output file:", outputFile);

      const apiKey = 'sk_b4504f94644f2d9e88cd902b5d255d66d76998e3f281468c';
      const modelId = "scribe_v1";

      try {
        const transcription = await transcribeAudio(apiKey, modelId, outputFile);
        console.log("Transcription:", transcription);

        // Display transcription in the UI instead of using a global variable
        const transcriptionDisplay = document.createElement("p");
        transcriptionDisplay.textContent = transcription;
        soundClips.appendChild(transcriptionDisplay);
      } catch (error) {
        console.error("Transcription error:", error);
      }
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

async function transcribeAudio(apiKey, modelId, file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("model_id", modelId);
    formData.append("file", file);

    xhr.open("POST", "https://api.elevenlabs.io/v1/speech-to-text");
    xhr.setRequestHeader("xi-api-key", apiKey);

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.text);
        } catch (error) {
          reject("Error parsing response: " + error.message);
        }
      } else {
        reject(`Error: ${xhr.status} - ${xhr.statusText}`);
      }
    };

    xhr.onerror = () => reject("Network error occurred.");
    xhr.send(formData);
  });
}