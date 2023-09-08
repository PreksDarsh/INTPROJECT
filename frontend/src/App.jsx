// import React from 'react'
// import Login from './admin/login'
// import {BrowserRouter, Routes, Route} from 'react-router-dom'
// import Dashboard from './admin/Dashboard'
// import Employee from './admin/Employee'
// import Profile from './admin/Profile'
// import Home from './admin/Home'
// import AddEmployee from './admin/AddEmployee'
// import EditEmployee from './admin/Editemployee'
// import Start from './Start'
// import EmployeeDetail from './user/EmployeeDetail'
// import EmployeeLogin from './user/EmployeeLogin'
// // import RoiSelector from './admin/RoiSelector';
// import Instrusion from './admin/intrusion'
// import Motion from './admin/motion'
// import Wirecrossing from './admin/wirecrossing'
// import Loitering from './admin/loitering'



// function App() {
//   // const [selectedRoi, setSelectedRoi] = useState(null);

//   // // Callback function to handle ROI selection
//   // const handleRoiSelected = (roiCoordinates) => {
//   //   setSelectedRoi(roiCoordinates);
//   //   // You can send ROI coordinates to the backend here or perform other actions.
//   // };

//   return (
//     <BrowserRouter>
//     <Routes>
//       <Route path='/' element={<Dashboard />}>
//         <Route path='' element={<Home />}></Route>
//         <Route path='/employee' element={<Employee />}></Route>
//       <Route path='/profile' element={<Profile />}></Route>

//       <Route path='/intrusion' element={<Instrusion />}></Route>
//       <Route path='/motion' element={<Motion />}></Route>
//       <Route path='/wirecrossing' element={<Wirecrossing />}></Route>
//       <Route path='/loitering' element={<Loitering />}></Route>



//         <Route path='/create' element={<AddEmployee />}></Route> 
//         <Route path='/employeeEdit/:id' element={<EditEmployee />}></Route> 
//       </Route>
//       <Route path='/login' element={<Login />}></Route>
//       <Route path='/start' element={<Start />}></Route>
//       <Route path='/employeeLogin' element={<EmployeeLogin />}></Route>
//       <Route path='/employeedetail/:id' element={<EmployeeDetail />}></Route>
//     </Routes>

// {/* Render the RoiSelector component
// {selectedRoi ? (
//         <div>
//           <h2>Selected ROI</h2>
//           <p>StartX: {selectedRoi.startX}</p>
//           <p>StartY: {selectedRoi.startY}</p>
//           <p>EndX: {selectedRoi.endX}</p>
//           <p>EndY: {selectedRoi.endY}</p>
//         </div>
//       ) : (
//         <RoiSelector onRoiSelected={handleRoiSelected} />
//       )} */}

//     </BrowserRouter>
//   )
// }

// export default App


import React, { useState } from 'react'; // Import useState from React

import Login from './admin/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './admin/Dashboard';
import Employee from './admin/Employee';
import Profile from './admin/Profile';
import Home from './admin/Home';
import AddEmployee from './admin/AddEmployee';
import EditEmployee from './admin/Editemployee';
import Start from './Start';
import EmployeeDetail from './user/EmployeeDetail';
import EmployeeLogin from './user/EmployeeLogin';
import Intrusion from './admin/intrusion';
import Motion from './admin/motion';
import Wirecrossing from './admin/wirecrossing';
import Loitering from './admin/loitering';

function App() {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard/>}>
          <Route path='' element={<Home />}></Route>
          <Route path='/employee' element={<Employee />}></Route>
          <Route path='/profile' element={<Profile />}></Route>

          <Route path='/intrusion' element={<Intrusion />}></Route>
          <Route path='/motion' element={<Motion />}></Route>
          <Route path='/wirecrossing' element={<Wirecrossing />}></Route>
          <Route path='/loitering' element={<Loitering />}></Route>

          <Route path='/create' element={<AddEmployee />}></Route>
          <Route path='/employeeEdit/:id' element={<EditEmployee />}></Route>
        </Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/start' element={<Start />}></Route>
        <Route path='/employeeLogin' element={<EmployeeLogin />}></Route>
        <Route path='/employeedetail/:id' element={<EmployeeDetail />}></Route>
      </Routes>

      {/* Render the RoiSelector component
      {selectedRoi ? (
        <div>
          <h2>Selected ROI</h2>
          <p>StartX: {selectedRoi.startX}</p>
          <p>StartY: {selectedRoi.startY}</p>
          <p>EndX: {selectedRoi.endX}</p>
          <p>EndY: {selectedRoi.endY}</p>
        </div>
      ) : (
        <RoiSelector onRoiSelected={handleRoiSelected} />
      )} */}
    </BrowserRouter>
  );
}

export default App;
