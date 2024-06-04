let video;
let poseNet;

// Right wrist
let rightWristX = 0;
let rightWristY = 0;

// Paths for the right wrist
let rightWristPath1;
let rightWristPath2;

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
  
  // Create a save button
  saveButton = createButton('Save Drawing');
  saveButton.position(10, height - 30);

  // Add a mousePressed event listener to the button
  saveButton.mousePressed(saveDrawing);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    // Update right wrist position
    rightWristX = poses[0].pose.keypoints[10].position.x / 2;
    rightWristY = poses[0].pose.keypoints[10].position.y;
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
  
  // Add current positions to paths for right wrist
  rightWristPath1.add(rightWristX - width / 4, rightWristY - height / 2);
  rightWristPath2.add(rightWristX + width / 3, rightWristY - height / 2);
  
  // Update and display each path
  rightWristPath1.update();
  rightWristPath1.display();
  
  rightWristPath2.update();
  rightWristPath2.display();
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
