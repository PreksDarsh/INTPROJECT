import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import video1 from '../videos/video1.mp4';
import video2 from '../videos/video2.mp4';
import axios from 'axios';
function Wirecrossing() {
const [selectedCam, setSelectedCam] = useState(''); // State for the selected camera
// const [SelectedAlgorithm,setSelectedAlgorithm]=useState('');
// const camOptions = ['cam1', 'cam2', 'cam3']; // List of camera options
const camOptions = [
    { id: '1', name: 'Camera 1' },
    { id: '2', name: 'Camera 2' },
    { id: '3', name: 'Camera 3' },
  ];
  const videoUrls = {
    1: video1,
    2: video2,
    3: video2
  };
  const handleCamSelect = (event) => {
    setSelectedCam(event.target.value);
  };

  return (
    <div>
        <h4 style={{ marginBottom: '40px' }}>WIRECROSSING DETECTION</h4>
      <div className='ml-4'style={{ marginBottom: '10px'}}>
        {/* <select value={selectedCam} onChange={handleCamSelect} className='form-control'  >
          <option value="">Select Camera</option>
          {camOptions.map(cam => (
            <option key={cam} value={cam}>{cam}</option>
          ))}
        </select> */}
        <select value={selectedCam} onChange={handleCamSelect} className='form-control'>
  <option value="">Select Camera</option>
  {camOptions.map(cam => (
    <option key={cam.id} value={cam.id}>{cam.name}</option>
  ))}
</select>

        {selectedCam && (
          <div className='mt-4' style={{ display: 'flex', justifyContent: 'center' }}>
            <ReactPlayer url={videoUrls[selectedCam]} playing={true} controls={true} width="700px" height="500px">
              Your browser does not support the video tag.
            </ReactPlayer>
          </div>
        )}
         <RoiSelector cameraId={selectedCam} />
      </div>
    </div>
  );
}


function RoiSelector({ cameraId }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [roiCoordinates, setRoiCoordinates] = useState(null);

  useEffect(() => {
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRoiCoordinates({ startX: x, startY: y, endX: x, endY: y });

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

    setRoiCoordinates({ startX, startY, endX: x, endY: y });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const sendRoiCoordinatesToBackend = (cameraId) => {
    const roiData = {
      startX: roiCoordinates.startX,
      startY: roiCoordinates.startY,
      endX: roiCoordinates.endX,
      endY: roiCoordinates.endY,
      cameraId: cameraId,
    };
   
axios.post('http://localhost:8081/api/wirecrossing', roiData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log('Backend response:', response.data);
    })
    .catch((error) => {
      console.error('Error sending ROI coordinates:', error);
    });
};

  return (
    <div className="App" style={{ marginTop: '20px' ,display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <h4>Draw ROI</h4>
  <canvas
    ref={canvasRef}
    style={{ position: 'absolute', top: 0, left: 0 }}
    width="640"
    height="480"
    onMouseDown={startDrawing}
    onMouseMove={continueDrawing}
    onMouseUp={endDrawing}
  />
 <button
  onClick={() => sendRoiCoordinatesToBackend(cameraId)}
  style={{ backgroundColor: '#D3D3D3', color: 'black' }}
>
  Detect Wirecrossing
</button>
</div>

  );
}

export default Wirecrossing;