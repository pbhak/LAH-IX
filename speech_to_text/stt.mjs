import { ElevenLabsClient } from "elevenlabs";

window.outputFile;

const client = new ElevenLabsClient();

const response = await fetch(

  outputFile

);

const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });

const transcription = await client.speechToText.convert({

  file: audioBlob,

  model_id: "scribe_v1",

});

console.log(transcription);