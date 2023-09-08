// const cv = require('opencv4nodejs');

// // Load your video stream (e.g., from an IP camera or a file)
// const videoCapture = new cv.VideoCapture('your_video_stream_url_or_file_path');

// // Define the region of interest (ROI) where intrusion detection will be applied
// const roiX = 100; // X-coordinate of the top-left corner of ROI
// const roiY = 100; // Y-coordinate of the top-left corner of ROI
// const roiWidth = 300; // Width of the ROI
// const roiHeight = 200; // Height of the ROI

// // Process each frame of the video feed
// while (true) {
//   const frame = videoCapture.read(); // Read a frame

//   // Extract the ROI from the frame
//   const roi = frame.getRegion(new cv.Rect(roiX, roiY, roiWidth, roiHeight));

//   // Perform intrusion detection logic here (e.g., detect objects, check for intrusions)

//   // Display the frame with detected intrusions
//   cv.imshow('Intrusion Detection', frame);
//   cv.waitKey(30); // Adjust frame rate as needed
// }




const cv = require('opencv4nodejs');

function performIntrusionDetection(roi) {
  // Convert the ROI to grayscale for motion detection
  const roiGray = roi.cvtColor(cv.COLOR_BGR2GRAY);

  // Define a background subtractor for motion detection
  const bgSubtractor = new cv.BackgroundSubtractorMOG2();

  // Apply background subtraction to detect changes in the ROI
  const fgMask = bgSubtractor.apply(roiGray);

  // Calculate the percentage of non-zero pixels in the foreground mask
  const nonZeroPixels = cv.countNonZero(fgMask);
  const totalPixels = roiGray.rows * roiGray.cols;
  const motionPercentage = (nonZeroPixels / totalPixels) * 100;

  // Set a threshold for intrusion detection (adjust as needed)
  const intrusionThreshold = 5; // Example: Consider intrusion if more than 5% of ROI shows motion

  // Check if the motion percentage exceeds the threshold
  const intrusionDetected = motionPercentage > intrusionThreshold;

  return intrusionDetected;
}

module.exports = performIntrusionDetection;
