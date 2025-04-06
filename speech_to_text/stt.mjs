import { ElevenLabsClient } from "elevenlabs";

window.outputFile;
window.outputText;

function transcribeAudio(apiKey, modelId, file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("model_id", modelId);
    formData.append("file", file);

    xhr.open("POST", "https://api.elevenlabs.io/v1/speech-to-text");
    xhr.setRequestHeader("xi-api-key", apiKey);

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.text);
      } else {
        reject(`Error: ${xhr.status} - ${xhr.statusText}`);
      }
    };

    xhr.onerror = () => reject("Network error occurred.");
    xhr.send(formData);
  });
}

const apiKey = 'sk_b4504f94644f2d9e88cd902b5d255d66d76998e3f281468c'
const modelId = "scribe_v1";

const response = await fetch(outputFile);
const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });

try {
  const transcription = await transcribeAudio(apiKey, modelId, audioBlob);
  console.log(transcription);
  window.outputText = transcription;
} catch (error) {
  console.error(error);
}