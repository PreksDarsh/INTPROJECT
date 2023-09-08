// const cv = require('opencv4nodejs');

// // Load your video stream (e.g., from an IP camera or a file)
// const videoCapture = new cv.VideoCapture('your_video_stream_url_or_file_path');

// // Define the wire coordinates (x1, y1, x2, y2)
// const wireX1 = 100; // X-coordinate of the start of the wire
// const wireY1 = 200; // Y-coordinate of the start of the wire
// const wireX2 = 500; // X-coordinate of the end of the wire
// const wireY2 = 200; // Y-coordinate of the end of the wire

// // Define the crossing count and threshold
// let crossingCount = 0;
// const crossingThreshold = 10; // Adjust as needed

// // Initialize variables for object tracking
// const objectTrackers = [];

// while (true) {
//   const frame = videoCapture.read(); // Read a frame

//   // Perform object tracking or detection here (e.g., detect moving objects)

//   // Track objects and check for wire crossing
//   objectTrackers.forEach((tracker) => {
//     const success = tracker.update(frame);
//     if (success) {
//       const { x, y, width, height } = tracker.getRegion();
//       const objectCenterX = x + width / 2;
//       const objectCenterY = y + height / 2;

//       // Check if the tracked object crosses the wire
//       if (
//         (objectCenterY < wireY1 && objectCenterY > wireY2) &&
//         ((objectCenterX >= wireX1 && objectCenterX <= wireX2) ||
//         (objectCenterX >= wireX2 && objectCenterX <= wireX1))
//       ) {
//         crossingCount += 1;
//       }
//     }
//   });

//   // Display the wire and crossing count on the frame
//   frame.drawLine(
//     new cv.Point(wireX1, wireY1),
//     new cv.Point(wireX2, wireY2),
//     new cv.Vec(0, 255, 0),
//     2
//   );
//   frame.putText(
//     `Wire Crossings: ${crossingCount}`,
//     new cv.Point(10, 30),
//     cv.FONT_HERSHEY_SIMPLEX,
//     1,
//     new cv.Vec(0, 0, 255),
//     2
//   );

//   // Display the frame
//   cv.imshow('Wire Crossing Detection', frame);
//   cv.waitKey(30); // Adjust frame rate as needed
// }

const cv = require('opencv4nodejs'); 

function performWireCrossingDetection(frame, prevFrameObjects, roiCoordinates) {
    // Convert the frame to grayscale for object detection
    const frameGray = frame.cvtColor(cv.COLOR_BGR2GRAY);
  
    // Define parameters for object detection (adjust as needed)
    const minObjectArea = 1000; // Minimum object area to consider
    const maxObjectArea = 5000; // Maximum object area to consider
  
    // Detect objects in the frame
    const objects = frameGray.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  
    // Filter objects based on area
    const filteredObjects = objects.filter((obj) => {
      const area = obj.area();
      return area >= minObjectArea && area <= maxObjectArea;
    });
  
    // Compare the positions of objects with ROI coordinates
    for (const obj of filteredObjects) {
      // Get the centroid of the object
      const centroid = obj.moments();
  
      // Calculate the centroid coordinates
      const centroidX = Math.floor(centroid.m10 / centroid.m00);
      const centroidY = Math.floor(centroid.m01 / centroid.m00);
  
      // Check if the centroid is within the predefined ROI
      if (
        centroidX >= roiCoordinates.startX &&
        centroidX <= roiCoordinates.endX &&
        centroidY >= roiCoordinates.startY &&
        centroidY <= roiCoordinates.endY
      ) {
        // Object has crossed the wire, trigger an alert
        return true;
      }
    }
  
    // Update the previous frame objects for comparison in the next frame
    prevFrameObjects = filteredObjects;
  
    // No wire crossing detected in this frame
    return false;
    
  }

  module.exports = performWireCrossingDetection;