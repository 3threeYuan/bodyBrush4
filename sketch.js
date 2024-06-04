let video;
let poseNet;

// Positions for wrists and ankles
let rightWristX = 0, rightWristY = 0;
let leftWristX = 0, leftWristY = 0;
let rightAnkleX = 0, rightAnkleY = 0;
let leftAnkleX = 0, leftAnkleY = 0;

// Paths for the wrists and ankles
let rightWristPath1, rightWristPath2;
let leftWristPath1, leftWristPath2;
let rightAnklePath1, rightAnklePath2;
let leftAnklePath1, leftAnklePath2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width / 2, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', gotPoses);

  // Hide the video element, and just show the canvas
  video.hide();
  
  // Initialize paths
  rightWristPath1 = new Path(255, 255, 255); // White path for right wrist
  rightWristPath2 = new Path(255, 255, 255); // White path for right wrist on the black background
  leftWristPath1 = new Path(255, 0, 0); // Red path for left wrist
  leftWristPath2 = new Path(255, 0, 0); // Red path for left wrist on the black background
  rightAnklePath1 = new Path(0, 255, 0); // Green path for right ankle
  rightAnklePath2 = new Path(0, 255, 0); // Green path for right ankle on the black background
  leftAnklePath1 = new Path(0, 0, 255); // Blue path for left ankle
  leftAnklePath2 = new Path(0, 0, 255); // Blue path for left ankle on the black background
  
  // Create a save button
  saveButton = createButton('Save Drawing');
  saveButton.position(10, height - 30);

  // Add a mousePressed event listener to the button
  saveButton.mousePressed(saveDrawing);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    // Update wrist and ankle positions
    rightWristX = poses[0].pose.keypoints[10].position.x / 2;
    rightWristY = poses[0].pose.keypoints[10].position.y;
    leftWristX = poses[0].pose.keypoints[9].position.x / 2;
    leftWristY = poses[0].pose.keypoints[9].position.y;
    rightAnkleX = poses[0].pose.keypoints[14].position.x / 2;
    rightAnkleY = poses[0].pose.keypoints[14].position.y;
    leftAnkleX = poses[0].pose.keypoints[13].position.x / 2;
    leftAnkleY = poses[0].pose.keypoints[13].position.y;
  }
}

function modelReady() {
  select('#status').html();
}

function draw() {
  // Draw black background for the whole canvas
  background(0);

  // Draw video on the left half of the canvas
  image(video, 0, 0, width / 2, height);
  
  // Add current positions to paths for wrists and ankles
  rightWristPath1.add(rightWristX - width / 4, rightWristY - height / 2);
  rightWristPath2.add(rightWristX + width / 3, rightWristY - height / 2);
  leftWristPath1.add(leftWristX - width / 4, leftWristY - height / 2);
  leftWristPath2.add(leftWristX + width / 3, leftWristY - height / 2);
  rightAnklePath1.add(rightAnkleX - width / 4, rightAnkleY - height / 2);
  rightAnklePath2.add(rightAnkleX + width / 3, rightAnkleY - height / 2);
  leftAnklePath1.add(leftAnkleX - width / 4, leftAnkleY - height / 2);
  leftAnklePath2.add(leftAnkleX + width / 3, leftAnkleY - height / 2);
  
  // Update and display each path
  rightWristPath1.update();
  rightWristPath1.display();
  
  rightWristPath2.update();
  rightWristPath2.display();
  
  leftWristPath1.update();
  leftWristPath1.display();
  
  leftWristPath2.update();
  leftWristPath2.display();
  
  rightAnklePath1.update();
  rightAnklePath1.display();
  
  rightAnklePath2.update();
  rightAnklePath2.display();
  
  leftAnklePath1.update();
  leftAnklePath1.display();
  
  leftAnklePath2.update();
  leftAnklePath2.display();
}

// Path class
class Path {
  constructor(r, g, b) {
    this.color = color(r, g, b);
    this.path = [];
  }
  
  add(x, y) {
    // Add a new point to the path
    this.path.push(createVector(x, y));
  }
  
  update() {
    // Shift the path up by one pixel each frame
    for (let i = 0; i < this.path.length; i++) {
      this.path[i].y -= 1;
    }
    
    // Remove the top point if it's off the top of the canvas
    if (this.path[0].y < 0) {
      this.path.splice(0, 1);
    }
  }
  
  display() {
    // Draw the path as a series of lines
    stroke(this.color);
    strokeWeight(4);
    noFill();
    
    beginShape();
    for (let i = 0; i < this.path.length; i++) {
      vertex(this.path[i].x + width / 3, this.path[i].y + height / 2);
    }
    endShape();
  }
}

function saveDrawing() {
  save('DrawingData.png');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
