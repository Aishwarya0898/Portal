import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link, Outlet, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useCookies } from 'react-cookie';

function Admindashboard() {
  const navigate = useNavigate()
  //const [name, SetName] = useState('')
  axios.defaults.withCredentials = true;
  useEffect(()=>{
    axios.get('http://127.0.0.1:3000/admindashboard')
    .then(res =>{
      if(res.data.Status === "Success"){
        //SetName(res.data[0].name);
      }else {
        navigate('/login')
      }
    })
  }, [])
  const handleLogout = () => {
		axios.get('http://127.0.0.1:3000/logout')
		.then(res => {
			navigate('/login')
		}).catch(err => console.log(err));
	}
  return (
    <div className="container-fluid">
    <div className="row flex-nowrap">
      <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
          <a href="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
            <span className="fs-5 fw-bolder d-none d-sm-inline">Welcome Admin</span>
          </a>
          <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
            <li>
              <a href="/admindashboard/home" className="nav-link text-white px-0 align-middle">
                <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/admindashboard/viewfacultyadmin" className="nav-link px-0 align-middle text-white">
                <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">View Users</span>
              </a>
            </li>
            <li>
              <a href="/admindashboard/admincoursedisplay" className="nav-link px-0 align-middle text-white">
                <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">View Courses</span>
              </a>
            </li>
            <li>
              <a href="/admindashboard/profileadmin" className="nav-link px-0 align-middle text-white">
                <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Profile</span>
              </a>
            </li>
            <li onClick={handleLogout}>
              <a href="/login" className="nav-link px-0 align-middle text-white">
                <i className="fs-4 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Logout</span>
              </a>
            </li>
         </ul>
       </div>
      </div>
      <div className="col p-0 m-0">
        <div className='p-2 d-flex justify-content-center shadow'>
          <h4>University Portal System</h4>						
		    </div>
        <Outlet/>
      </div>
   </div>
 </div>
  )
}

export default Admindashboard