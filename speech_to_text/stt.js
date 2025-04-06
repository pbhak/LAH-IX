const texts = document.querySelector('.texts');
//const record = document.getElementById("record");
//const stop = document.getElementById('stop');
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;  
const recognition = new window.SpeechRecognition();
recognition.interimResults = true; // Show interim results
recognition.lang = 'en-US'; // Set the language for recognition
recognition.continuous = true; // Keep listening until stopped
let p = document.createElement('p');
recognition.addEventListener('result', e => {
  const text = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('')

  p.innerText = text;
  texts.appendChild(p); 

  if (e.results[0].isFinal) {
    p = document.createElement('p');
  }

  console.log(e);

})

recognition.start();




