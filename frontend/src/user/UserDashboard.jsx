import React from 'react'
import axios from 'axios'
function UserDashboard() {
  return (
    <div>Userdashboard</div>
  )
}

export default UserDashboard

// import React, { useEffect, useState } from 'react'
// import { Link, Outlet,useNavigate, useParams } from 'react-router-dom'

// // function EmployeeDetail() {
//     function UserDashboard() {
//     const {id} = useParams();
//     const navigate = useNavigate()
//     const [employee, setEmployee] = useState([])
//     useEffect(()=> {
//         axios.get('http://localhost:8081/get/'+id)
//         .then(res => setEmployee(res.data.Result[0]))
//         .catch(err => console.log(err));
//     },[id]);
//     const handleLogout = () => {
// 		axios.get('http://localhost:8081/logout')
// 		.then(res => {
// 			navigate('/start')
// 		}).catch(err => console.log(err));
// 	}
    

//   return (
//     <div className="container-fluid">
//       <div className="row flex-nowrap">
//         <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
//           <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
//             <a href="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
//               <span className="fs-5 fw-bolder d-none d-sm-inline">User Dashboard</span>
//             </a>
//             <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
//               <li>
//                 <Link to="/" data-bs-toggle="collapse" className="nav-link text-white px-0 align-middle">
//                   <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/cameras" className="nav-link px-0 align-middle text-white">
//                   <i className="fs-4 bi-camera"></i> <span className="ms-1 d-none d-sm-inline">Cameras</span>
//                 </Link>
//               </li>
//               <li onClick={handleLogout}>
//                 <a href="#" className="nav-link px-0 align-middle text-white">
//                   <i className="fs-4 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Logout</span>
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//         <div className="col p-0 m-0">
//           <div className="p-2 d-flex justify-content-center shadow">
//             <h4>USER</h4>
//           </div>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }


// export default UserDashboard
