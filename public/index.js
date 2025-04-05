let handPose;
let video;
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

/////////////////

function preload () {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO).size(640, 480).hide();
  handPose.detectStart(video, results => hands = results);
}

function draw() {
  let coords = []
  image(video, 0, 0, width, height);

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      if (keypoint.name.includes('thumb') || keypoint.name.includes('index') || keypoint.name.includes('middle')) {
        console.log(`${keypoint.name.split('_')[0]} ${keypoint.name.includes('thumb') ? keypoint.name.split('_')[1] : keypoint.name.split('_')[2]} (x, y): (${Number(keypoint.x.toFixed(2))}, ${Number(keypoint.y.toFixed(2))})`)
        coords.push([Number(keypoint.x.toFixed(2)), Number(keypoint.y.toFixed(2))])
        fill(0, 255, 0);
        circle(keypoint.x, keypoint.y, 10);
      }
    } 
  }
  
  if (coords.length > 0) {
    console.log('________________________')
    console.log(get_highest_difference(minify(coords), minify(SCROLL)))
    console.log('________________________')
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