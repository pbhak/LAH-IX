require('dotenv').config();
console.log(process.env.ELEVENLABS_API_KEY);

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia is supported");
    navigator.mediaDevices
        .getUserMedia(
            {
                audio: true,
                video: false
            }
        )
    .then((stream) => {})

    .catch((err) => {
        console.error("The following getUserMedia error occurred: " + err);
    });
} else {
    console.log("getUserMedia is not supported on your browser!");
}

const mediaRecorder = new MediaRecorder(stream);

addEventListener("keydown", (event) => {});

onkeydown = (event) => {
    if (event.key === "Enter") {
        mediaRecorder.start();
        console.log("Recording started");
    } else if (event.key === "Escape") {
        mediaRecorder.stop();
        console.log("Recording stopped");
    }
}

