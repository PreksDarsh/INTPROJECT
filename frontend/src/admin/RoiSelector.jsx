import React, { useRef, useState } from 'react';

function Roiselector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [roiCoordinates, setRoiCoordinates] = useState(null);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Initialize the coordinates of the bounding box
    setRoiCoordinates({ startX: x, startY: y, endX: x, endY: y });

    // Set the initial drawing state
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 0, 0);
  };

  const continueDrawing = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { startX, startY } = roiCoordinates;

    // Update the bounding box coordinates
    setRoiCoordinates({ startX, startY, endX: x, endY: y });

    // Redraw the bounding box with updated coordinates
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const sendRoiCoordinatesToBackend = () => {
    // Prepare the ROI coordinates data
    const roiData = {
      startX: roiCoordinates.startX,
      startY: roiCoordinates.startY,
      endX: roiCoordinates.endX,
      endY: roiCoordinates.endY,
    };

    // Send the ROI coordinates to the backend using fetch or another method
    fetch('/api/intrusion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roiData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        console.log('Backend response:', data);
      })
      .catch((error) => {
        console.error('Error sending ROI coordinates:', error);
      });
  };

  return (
    <div className="App">
      <h1>Draw ROI</h1>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        onLoadedData={() => {
          videoRef.current.play();
        }}
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        onMouseDown={startDrawing}
        onMouseMove={continueDrawing}
        onMouseUp={endDrawing}
      />
      <button onClick={sendRoiCoordinatesToBackend}>Detect Intrusion</button>
    </div>
  );
}

export default Roiselector;
