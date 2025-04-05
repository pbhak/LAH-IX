const ELEVENLABS_API_KEY = 'sk_b4504f94644f2d9e88cd902b5d255d66d76998e3f281468c'

let stream;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia is supported");
    navigator.mediaDevices
        .getUserMedia(
            {
                audio: true,
                video: false
            }
        )
    .then((mediaStream) => {
        stream = mediaStream; // Assign the stream here
        const mediaRecorder = new MediaRecorder(stream); // This line will now work correctly after stream is assigned
    })

    .catch((err) => {
        console.error("The following getUserMedia error occurred: " + err);
    });
} else {
    console.log("getUserMedia is not supported on your browser!");
}

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

