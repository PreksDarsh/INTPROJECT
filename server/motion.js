// const cv = require('opencv4nodejs');

// // Load your video stream (e.g., from an IP camera or a file)
// const videoCapture = new cv.VideoCapture('your_video_stream_url_or_file_path');

// // Initialize variables for motion detection
// let prevFrame = null;

// while (true) {
//   const frame = videoCapture.read(); // Read a frame

//   // Convert the frame to grayscale
//   const gray = frame.cvtColor(cv.COLOR_BGR2GRAY);

//   // Apply Gaussian blur to reduce noise and improve motion detection
//   const blurred = gray.gaussianBlur(new cv.Size(21, 21), 0);

//   // Initialize the previous frame on the first iteration
//   if (!prevFrame) {
//     prevFrame = blurred;
//     continue;
//   }

//   // Compute the absolute difference between the current and previous frame
//   const frameDelta = prevFrame.absdiff(blurred);
//   const thresh = frameDelta.threshold(25, 255, cv.THRESH_BINARY);

//   // Dilate the thresholded image to fill in holes
//   const dilated = thresh.dilate(new cv.Mat(), new cv.Point(-1, -1), 2);

//   // Find contours in the thresholded image
//   const contours = dilated.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

//   // If contours are detected, motion is detected
//   if (contours.length > 0) {
//     console.log('Motion detected!');
//   }

//   // Display the frame with detected motion
//   cv.imshow('Motion Detection', frame);
//   cv.waitKey(30); // Adjust frame rate as needed

//   // Update the previous frame
//   prevFrame = blurred;
// }


function performMotionDetection(roi, frameDiffThreshold) {
  // Convert the ROI to grayscale for analysis (if needed)
  // const roiGray = roi.cvtColor(cv.COLOR_BGR2GRAY);

  // Calculate the absolute difference between consecutive frames
  // You would typically compare the current frame with a previous frame
  // For simplicity, we assume that 'roi' contains the current frame
  const frameDiff = roi.absDiff(roi);

  // Threshold the frame difference to identify areas with significant changes
  const motionMask = frameDiff.threshold(frameDiffThreshold, 255, cv.THRESH_BINARY);

  // Find contours in the motion mask
  const contours = motionMask.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // If contours are detected, motion is detected
  if (contours.length > 0) {
    return true;
  }

  // No motion detected
  return false;
}
module.exports = performMotionDetection;