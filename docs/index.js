let handPose;
let video;
let connections;
let hands = [];

///////////////// CONSTANTS

const SCROLL = [
  [200.28, 450.88],
  [235.3, 397.12],
  [252.6, 350.83],
  [271.74, 316.99],
  [228.95, 337.74],
  [251.39, 304.1],
  [266.36, 293.14],
  [276.57, 293.66],
  [200.39, 326.46],
  [220.3, 280.52],
  [235.8, 284.75],
  [247.12, 308.48]
];

const TOGETHERNESS_THRESHOLD = 0.98
const CLICK_THRESHOLD = 16
const RIGHT_CLICK_THRESHOLD = 20

async function send_req(point) {
  console.log('called')
  await send_cursor_request(Number(point.x.toFixed(2)), Number(point.y.toFixed(2)));
}

function preload () {
  handPose = ml5.handPose();
}

function setup() {
  mainCanvas = document.getElementById('main')
  createCanvas(640, 480, mainCanvas);
  video = createCapture(VIDEO, true).size(640, 480).hide();
  handPose.detectStart(video, results => hands = results);
  connections = handPose.getConnections();
}

function draw() {
  let allCoords = []
  let latestY;
  let coords = []

  image(video, 0, 0, width, height);
  translate(width,0); 
  scale(-1.0,1.0);   // flip video
  image(video, 0, 0, width, height);

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    for (let k = 0; k < hand.keypoints.length; k++) {
      for (let l = 0; l < hand.keypoints.length; l++) {
        const element1 = hand.keypoints[k]
        const element2 = hand.keypoints[l]
        
        const element1Name = element1.name.split('_')[0]
        const element2Name = element2.name.split('_')[0]

        const element1Joint = element1.name.split('_')[element1.name.split('_').length - 1]
        const element2Joint = element2.name.split('_')[element2.name.split('_').length - 1]
        
        if (!(element1Name == 'index' && element2Name == 'middle') || (element2Name == 'index' && element1Name == 'middle') || !(element1Joint == element2Joint)) {
          continue
        }

        if (element1Joint == 'tip') {
          latestY = calculateY(element1.y, element2.y)
          // console.log(`tip y value is ${latestY}`)
        }

        if (element1.name.split('_')[-1] == element2.name.split('_')[-1] && element1Joint != 'mcp' && element1Joint != 'tip') {
          stroke(0, 0, 0);
          strokeWeight(2);
          // console.log(`drawing line ${element1Joint} with distance ${distance(element1.x, element2.x, element1.y, element2.y)}`)
          allCoords.push(distance(element1.x, element2.x, element1.y, element2.y))
          coords.push(distance(element1.x, element2.x, element1.y, element2.y))
          line(element1.x, element1.y, element2.x, element2.y)
        }
      }
      }
  
    if (fingersTogether(...allCoords)) {
      window.scrollBy({
        top: ((latestY) * 5),
        behavior: 'smooth'
      });
    }
    allCoords = []

    ////// LEFT CLICKING

    let clickCoords = []

    for (let m = 0; m < hand.keypoints.length; m++) {
      const point = hand.keypoints[m];
      const pointName = point.name.split('_')[0]
      const pointJoint = point.name.split('_')[hand.keypoints[m].name.split('_').length - 1]
      
      // Only continue if current point is thumb or index finger tip
      if (!(pointName == 'thumb' || pointName == 'index') || !(pointJoint == 'tip')) {
        continue;
      }

      clickCoords.push([point.x, point.y])
    }

    // Draw line for click points
    stroke(255, 255, 255);
    strokeWeight(2);
    const lineDistance = distance(clickCoords[0][0], clickCoords[1][0], clickCoords[0][1], clickCoords[1][1])
    console.log(`drawing line with distance ${lineDistance}`)
    line(clickCoords[0][0], clickCoords[0][1], clickCoords[1][0], clickCoords[1][1]);
    
    (async function () {
      await registerClick(lineDistance);
    })();
    
    clickCoords = []

    //////////////////////
    /////// RIGHT CLICKING

    let rightClickCoords = []

    for (let m = 0; m < hand.keypoints.length; m++) {
      const point = hand.keypoints[m];
      const pointName = point.name.split('_')[0]
      const pointJoint = point.name.split('_')[hand.keypoints[m].name.split('_').length - 1]
      
      // Only continue if current point is thumb or index finger tip
      if (!(pointName == 'thumb' || pointName == 'middle') || !(pointJoint == 'tip')) {
        continue;
      }

      rightClickCoords.push([point.x, point.y])
    }

    // Draw line for click points
    stroke(255, 255, 255);
    strokeWeight(2);
    const rightClickLineDistance = distance(rightClickCoords[0][0], rightClickCoords[1][0], rightClickCoords[0][1], rightClickCoords[1][1])
    // console.log(`drawing line (sec) with distance ${rightClickLineDistance}`)
    console.log(rightClickLineDistance)
    line(rightClickCoords[0][0], rightClickCoords[0][1], rightClickCoords[1][0], rightClickCoords[1][1]);
    
    (async function () {
      await registerSecClick(rightClickLineDistance);
    })();
    
    rightClickCoords = []

    //////////////////////
    

    for (let l = 0; l < hand.keypoints.length; l++) {
      const point = hand.keypoints[l]
  
      if (!(point.name.split('_')[0] == 'index') || point.name.split('_')[point.name.split('_').length - 1] != 'tip') {
        continue
      }

      fill(0, 255, 0);

      send_req(point)

      // (async function () {
      //   await new Promise(r => setTimeout(r, 200));
      // })().then(() => send_req(point));

      circle(point.x, point.y, 10);
     }

     

     for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = hand.keypoints[pointAIndex];
      let pointB = hand.keypoints[pointBIndex];
      stroke(255, 0, 0);
      strokeWeight(2);
      line(pointA.x, pointA.y, pointB.x, pointB.y);
          
      // if (pointA.name.includes('index') || pointA.name.includes('middle')) {
      //   console.log('----------------------')
      //   console.log(`${pointA.name} to ${pointB.name}`)
      //   console.log(distance(pointA.x, pointB.x, pointA.y, pointB.y))
      //   console.log('----------------------')
      // }
    }
    // console.log('/////////////////////////////')
  }

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      if (keypoint.name.includes('index') || keypoint.name.includes('middle')) {
        // console.log(`${keypoint.name.split('_')[0]} ${keypoint.name.includes('thumb') ? keypoint.name.split('_')[1] : keypoint.name.split('_')[2]} (x, y): (${Number(keypoint.x.toFixed(2))}, ${Number(keypoint.y.toFixed(2))})`)
        // coords.push([Number(keypoint.x.toFixed(2)), Number(keypoint.y.toFixed(2))])
        // fill(0, 255, 0);
        // circle(keypoint.x, keypoint.y, 10);
      }
    } 
  }
}

function minify(coords) {
  if (coords.length > 12) {
    coords = coords.slice(0, 12)
  }

  let x_values = coords.map(x => x[0])
  let y_values = coords.map(x => x[1])
  const smallest_x = Math.min(...x_values)
  const smallest_y = Math.min(...y_values)
  x_values = x_values.map(num => num - smallest_x)
  y_values = y_values.map(num => num - smallest_y)
  const final_array = []
  
  for (let i = 0; i < x_values.length; i++) {
    final_array.push([parseFloat(Number(x_values[i]).toFixed(2)), parseFloat(Number(y_values[i]).toFixed(2))])
  }

  return final_array
}

function get_highest_difference(arr1, arr2) {
  let differences = []
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr1[i].length; j++) {
      differences.push(Math.abs(arr1[i][j] - arr2[i][j]))
    }
  }

  // return parseFloat(Number(Math.max(...differences)).toFixed(2))
  return [Math.min(...differences), Math.max(...differences)]
}

function distance(x1, x2, y1, y2) {
  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
}

function fingersTogether(pip, dip) {
  return pip / dip >= TOGETHERNESS_THRESHOLD
}

async function registerClick(distance) {
  if (distance > CLICK_THRESHOLD) {
    return false;
  }

  // trigger click
  console.log('clicking!')
  const options = {
    method: 'POST',
    mode: 'no-cors'
  };
  await fetch("http://localhost:8000/click", options).then(value => {
    return value;
  });
}

async function registerSecClick(distance) {
  if (distance > RIGHT_CLICK_THRESHOLD) {
    return false;
  }

  // trigger click
  console.log('clicking (sec)!')
  const options = {
    method: 'POST',
    mode: 'no-cors'
  };
  await fetch("http://localhost:8000/secclick", options).then(value => {
    return value;
  });
}

function calculateY(y1, y2) {
  preY = (480 - (y1 + y2) / 2 ) - 240
  if (preY < 0) {
    preY *= 9
  }

  return preY
}

async function send_cursor_request(x, y) {
  // console.log(`x: ${x}, y: ${y}`)
  const options = {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({ x, y }),
    mode: 'no-cors'
  };
  // console.log(JSON.stringify({ x, y }))
  await fetch("http://localhost:8000/cursor", options).then(value => {
    // console.log(`returned value: ${value}`)
    return value;
  });
}

const texts = document.getElementById('stt');
//const record = document.getElementById("record");
//const stop = document.getElementById('stop');
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;  
const recognition = new window.SpeechRecognition();
recognition.interimResults = true; // Show interim results
recognition.lang = 'en-US'; // Set the language for recognition
recognition.continuous = true; // Keep listening until stopped
let p = document.createElement('p');
recognition.addEventListener('result', e => {
  let text = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('')

  if (e.results[0].isFinal) {
    p = document.createElement('p');
  }

  p.textContent = text;
  texts.textContent = new Date().toTimeString().split(' ')[0] + ' - ' + text; 
  text = ''

  if(texts.selectionStart == texts.selectionEnd) {
    texts.scrollTop = texts.scrollHeight;
  }

  console.log(text);

})

recognition.start();
