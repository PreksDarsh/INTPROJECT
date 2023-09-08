import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import video1 from '../videos/video1.mp4';
import video2 from '../videos/video2.mp4';
function EmployeeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState([]);
    const [selectedCam, setSelectedCam] = useState(''); // State for selected camera
    // const camOptions = ['cam1', 'cam2', 'cam3'];
    const videoUrls = {
        cam1: video1,
        cam2: video2,
        cam3: video2
    };

    useEffect(() => {
        axios.get('http://localhost:8081/get/' + id)
            .then(res => {
                // alert("selectedCam:"+res.data.Result[0].selectedCamera);
                setEmployee(res.data.Result[0]);
                setSelectedCam(res.data.Result[0].selectedCamera);
            })
            .catch(err => console.log(err));
    }, []);

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
            .then(res => {
                navigate('/start');
            })
            .catch(err => console.log(err));
    };

    const handleCamSelect = (event) => {
        setSelectedCam(event.target.value);
    };

    return (
        <div>
            <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
                <img src={`http://localhost:8081/images/${employee.image}`} alt="" className='empImg' />
                <div className='d-flex align-items-left flex-column mt-5'>
                    <h3 className='mb-2'>Name: {employee.name}</h3>
                </div>
                <div className='ml-4'>
                    {/* <select value={selectedCam} onChange={handleCamSelect} className='form-control'>
                        <option value="">Select Camera</option>
                        {camOptions.map(cam => (
                            <option key={cam} value={cam}>{cam}</option>
                        ))}
                    </select> */}
                    {selectedCam && (
                        <div className='mt-4'>
                            <ReactPlayer url={videoUrls[selectedCam]} playing={true} controls={true} width="700px" height="500px">
                                Your browser does not support the video tag.
                            </ReactPlayer>
                        </div>
                    )}
                </div>
                <div>
                    <button className='btn btn-primary mt-3' onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDetail;