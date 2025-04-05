import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient();

const response = await fetch(

  "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"

);

const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });

const transcription = await client.speechToText.convert({

  file: audioBlob,

  model_id: "scribe_v1",

});

console.log(transcription);