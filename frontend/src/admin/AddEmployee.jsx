import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddEmployee() {
	const camOptions = ['cam1', 'cam2', 'cam3'];
	const [data, setData] = useState({
		name: '',
		email: '',
		password: '',
		address: '',
		salary: '',
		image: '',
		selectedCam: '',
	})
	const navigate = useNavigate()

	const handleSubmit = (event) => {
		event.preventDefault();
		const formdata = new FormData();
		formdata.append("name", data.name);
		formdata.append("email", data.email);
		formdata.append("password", data.password);
		formdata.append("address", data.address);
		formdata.append("salary", data.salary);
		formdata.append("image", data.image);
		formdata.append("selectedCam", data.selectedCam);
		alert('formdata' + formdata);
		// formdata.append("selectedCamera", data.selectedCamera);
		axios.post('http://localhost:8081/create', formdata)
			.then(res => {
				navigate('/employee')
			})
			.catch(err => console.log(err));
	}
	return (
		<div className='d-flex flex-column align-items-center pt-4'>
			<h2>Add Employee</h2>
			<form class="row g-3 w-50" onSubmit={handleSubmit}>
				<div class="col-12">
					<label for="inputName" class="form-label">Name</label>
					<input type="text" class="form-control" id="inputName" placeholder='Enter Name' autoComplete='off'
						onChange={e => setData({ ...data, name: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputEmail4" class="form-label">Email</label>
					<input type="email" class="form-control" id="inputEmail4" placeholder='Enter Email' autoComplete='off'
						onChange={e => setData({ ...data, email: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputPassword4" class="form-label">Password</label>
					<input type="password" class="form-control" id="inputPassword4" placeholder='Enter Password'
						onChange={e => setData({ ...data, password: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputSalary" class="form-label">Salary</label>
					<input type="text" class="form-control" id="inputSalary" placeholder="Enter Salary" autoComplete='off'
						onChange={e => setData({ ...data, salary: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputAddress" class="form-label">Address</label>
					<input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St" autoComplete='off'
						onChange={e => setData({ ...data, address: e.target.value })} />
				</div>
				<div class="col-12 mb-3">
					<select value={data.selectedCam} onChange={e => setData({ ...data, selectedCam: e.target.value })} className='form-control'>
						<option value="">Select Camera</option>
						{camOptions.map(cam => (
							<option key={cam} value={cam}>{cam}</option>
						))}
					</select>
				</div>
				<div class="col-12 mb-3">
					<label class="form-label" for="inputGroupFile01">Select Camera</label>
					<input type="file" class="form-control" id="inputGroupFile01"
						onChange={e => setData({ ...data, image: e.target.files[0] })} />
				</div>
				{/* <div class="col-12">
  <label for="inputCamera" class="form-label">Select Cameras</label>
  <select
  id="inputCamera"
  className="form-control"
  multiple // This allows multiple selections
  value={data.selectedCameras} // Bind the selected values to the state array
  onChange={(e) =>
    setData({
      ...data,
      selectedCameras: Array.from(e.target.selectedOptions, (option) => option.value),
    })
  }
>
  {/* Display options "1," "2," and "3" */}
				{/* <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
</select>
</div> */}

				<div class="col-12">
					<button type="submit" class="btn btn-primary">Create</button>
				</div>
			</form>
		</div>

	)
}

export default AddEmployee  