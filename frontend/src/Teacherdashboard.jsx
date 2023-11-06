import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import './style.css'


function Teacherdashboard() {
  const navigate = useNavigate();
  //const classes = useStyles();

  useEffect(() => {
    axios.get('http://127.0.0.1:3000/teacherdashboard')
      .then(res => {
        if (res.data.Status === "Success") {
          // SetName(res.data[0].name);
        } else {
          //console.log('Caught You!')
          //navigate('/login');
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
    axios.get('http://127.0.0.1:3000/logout')
      .then(res => {
        navigate('/login');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container-fluid">
    <div className="row flex-nowrap">
      <nav id="sidebar" className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
          <a className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
            <span className="fs-5 fw-bolder d-none d-sm-inline">Welcome, Faculty</span>
          </a>
          <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
            <li>
              <a href="/teacherdashboard/home" className="nav-link text-white px-0 align-middle">
                <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/teacherdashboard/viewcoursesteacher" className="nav-link px-0 align-middle text-white">
                <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">View Courses</span>
              </a>
            </li>
            <li>
              <a href="/teacherdashboard/profileteacher" className="nav-link px-0 align-middle text-white">
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
      </nav> 
      <div className="col p-0 m-0">
        <button type="button" id="sidebarToggle" className="btn btn-dark d-md-none">
          <i className="bi bi-list"></i>
        </button>
        <div className='p-2 d-flex justify-content-center shadow'>
          <h4>University Portal</h4>						
		    </div>
        <Outlet/>
      </div>
   </div>
 </div>
  
  );
}

export default Teacherdashboard;
