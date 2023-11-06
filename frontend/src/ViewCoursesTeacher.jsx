import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useCookies } from 'react-cookie';
import { Grid, Paper, Typography } from '@mui/material';

const styles = {
  paper: {
    padding: '20px',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.87)',
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    '&:hover': {
      background: '#ffcccb',
    }
  },
};

function ViewCoursesTeacher() {
  const id = localStorage.getItem('userId');
  //const classes = useStyles();
  const [facultyCourse, setFacultyCourse] = useState([]);
  const navigate = useNavigate();
  //const [student, setStudent] = useState({});
  //const [isEditing, setIsEditing] = useState(false);
  //const [isProfileSaved, setIsProfileSaved] = useState(false);
  //const [error, setError] = useState(null);

  
  useEffect(() => {
    axios.get(`http://127.0.0.1:3000/getFacultyCourses?id=${id}`)
      .then(res => {
        if (res.data.Status === 'Success') {
          setFacultyCourse(res.data.Result);
        } else {
          // Handle error if necessary
          console.error('API request failed:', res.data.Status);
        }
      })
      .catch(err => console.log(err));
  },[]);
  


  return (
    <div className='container mt-4'>
      <Typography variant="h4" className='text-center mb-4'>Courses</Typography>
      <Grid container spacing={2} justifyContent='center'>
        {facultyCourse.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Link to={`/teacherdashboard/viewcoursedetailsFaculty/${course.Id}`} style={{ textDecoration: 'none' }}>
              <Paper elevation={3} style={styles.paper}>
                <Typography variant="h6">{course.CourseCode}: {course.courseName}</Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default ViewCoursesTeacher
