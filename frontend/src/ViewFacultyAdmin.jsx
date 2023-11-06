import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCookies } from 'react-cookie';

function ViewFacultyAdmin() {

  const navigate = useNavigate();
  const handleInsertClick = () => {
    navigate('/admindashboard/insertuser');
  };

  //const [student, setStudent] = useState({});

  //useEffect(() => {
    //axios
      //.get(`http://127.0.0.1:3000/viewfacultyadmin`)
      //.then((res) => {
        //setStudent(res.data.Result)
        //console.log(res.data.Result)
      //})
      //.catch((err) => console.log(err));
  //},[]);


  return (
    <Box p={3} display="flex" justifyContent="center" mt={3}>
      <Box px={3} pt={2} pb={3} width="25%">
        <Button variant="contained" color="success" fullWidth component="a" href="/admindashboard/adminviewstudent">
          View Student
        </Button>
        <Button variant="contained" color="success" fullWidth component="a" href="/admindashboard/adminviewfaculty" sx={{ mt: 1 }}>
          View Faculty
        </Button>
        <Button variant="contained" color="success" fullWidth component="a" href="/admindashboard/adminviewadmin" sx={{ mt: 1 }}>
          View Admin
        </Button>
        <br/>
        <br/>
        <br/>
        <Button variant='contained' color='primary' fullWidth onClick={handleInsertClick}>
            Insert User
        </Button>
      </Box>
    </Box>
  
  )
}

export default ViewFacultyAdmin