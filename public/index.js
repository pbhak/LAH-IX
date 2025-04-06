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

/////////////////

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
          document.getElementById('yDisplay').innerHTML = latestY
          console.log(`tip y value is ${latestY}`)
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

    for (let l = 0; l < hand.keypoints.length; l++) {
      const point = hand.keypoints[l]
  
      if (!(point.name.split('_')[0] == 'index') || point.name.split('_')[point.name.split('_').length - 1] != 'tip') {
        continue
      }

      fill(0, 255, 0);

      document.getElementById('indexX').innerHTML = point.x
      document.getElementById('indexY').innerHTML = point.y

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

function calculateY(y1, y2) {
  preY = (480 - (y1 + y2) / 2 ) - 240
  if (preY < 0) {
    preY *= 3
  }

  return preY
}