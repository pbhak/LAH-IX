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
