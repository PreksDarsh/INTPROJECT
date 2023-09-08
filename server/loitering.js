// const cv = require('opencv4nodejs');

// // Load your video stream (e.g., from an IP camera or a file)
// const videoCapture = new cv.VideoCapture('your_video_stream_url_or_file_path');

// // Define the loitering area (a region of interest)
// const loiteringX = 100; // X-coordinate of the top-left corner of the area
// const loiteringY = 100; // Y-coordinate of the top-left corner of the area
// const loiteringWidth = 200; // Width of the area
// const loiteringHeight = 150; // Height of the area

// // Define the loitering time threshold in seconds
// const loiteringThreshold = 10; // Adjust as needed

// // Initialize variables for loitering detection
// let startTime = null;

// while (true) {
//   const frame = videoCapture.read(); // Read a frame

//   // Extract the loitering area from the frame
//   const loiteringArea = frame.getRegion(new cv.Rect(loiteringX, loiteringY, loiteringWidth, loiteringHeight));

//   // Perform object tracking or detection within the loitering area

//   // If an object is detected or tracked, start the timer
//   if (someCondition) { // Replace with your detection or tracking logic
//     startTime = Date.now();
//   }

//   // If an object leaves the area, reset the timer
//   if (anotherCondition) { // Replace with your logic
//     startTime = null;
//   }

//   // If the timer exceeds the threshold, loitering is detected
//   if (startTime && (Date.now() - startTime) / 1000 > loiteringThreshold) {
//     console.log('Loitering detected!');
//   }

//   // Display the frame
//   cv.imshow('Loitering Detection', frame);
//   cv.waitKey(30); // Adjust frame rate as needed
// }


function performLoiteringDetection(roi, minTimeThresholdInSeconds) {
  // Initialize variables for loitering detection
  let objectPresent = false;
  let loiteringStartTime = null;

  // Convert the ROI to grayscale for analysis (if needed)
  // const roiGray = roi.cvtColor(cv.COLOR_BGR2GRAY);

  // Simulated logic for loitering detection
  // In this example, loitering is detected when an object remains in the ROI for at least minTimeThresholdInSeconds

  if (!roi.empty()) {
    if (!objectPresent) {
      // Object has entered the ROI, start the timer
      objectPresent = true;
      loiteringStartTime = Date.now();
    } else {
      // Object is still present, check if loitering time threshold is exceeded
      const currentTime = Date.now();
      const elapsedTimeInSeconds = (currentTime - loiteringStartTime) / 1000;

      if (elapsedTimeInSeconds >= minTimeThresholdInSeconds) {
        // Loitering detected, return true
        return true;
      }
    }
  } else {
    // Object has left the ROI, reset the detection state
    objectPresent = false;
    loiteringStartTime = null;
  }

  // No loitering detected
  return false;
}
module.exports = performLoiteringDetection;