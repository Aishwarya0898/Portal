import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
  } from '@material-ui/core';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(3),
      marginTop: theme.spacing(0),
    },
    tableContainer: {
      borderRadius: theme.spacing(1),
      boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    actionButtons: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    dialog: {
        padding: theme.spacing(2),
    },
  }));


function AdminCourseDisplay() {

    const [student, setStudent] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ courseCode: '', courseName: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const classes = useStyles();

    // useEffect(() => {
    //   axios
    //     .get(`http://127.0.0.1:3000/getCourses`)
    //     .then((res) => {
    //       setStudent(res.data.Result)
    //       console.log(res.data.Result)
    //     })
    //     .catch((err) => console.log(err));
    // },[]);

    const fetchCourses = () => {
      axios
      .get(`http://127.0.0.1:3000/getCourses`)
      .then((res) => {
        setStudent(res.data.Result)
        console.log(res.data.Result)
      })
      .catch((err) => console.log(err));
    };
    
  
    useEffect(() => {
      fetchCourses(); // Fetch courses when the page is initially loaded
    }, []);

    const handleAddCourse = (event) => {
      event.preventDefault();
      
      // Check if the course code already exists
      const existingCourseCode = student.find(course => course.CourseCode === newCourse.courseCode);
      const existingCourseName = student.find(course => course.CourseName === newCourse.courseName);
      
      if (existingCourseCode || existingCourseName) {
        setSuccessMessage('Course already exists! Please add a different course');
        setNewCourse(newCourse);
      } else {
        // If course code doesn't exist, add the course
        axios.post('http://127.0.0.1:3000/addCourse', newCourse)
          .then(res => {
            if(res.data.Status === "Success") {
              setSuccessMessage('Course added successfully!');
              // Update the student state to include the new course
              setStudent(prevStudent => [...prevStudent, newCourse]);
              fetchCourses();
            } else {
              alert("Error");
              console.log(console.error());
            }
          })
          .catch(err => console.error(err));
      }
      
      // Close the dialog
      setIsDialogOpen(false);
    };

    const handleViewStudent = (courseId) => {
      navigate(`/admindashboard/admincoursestudent?courseId=${courseId}`);
      //console.log(courseId);
    };

    const handleViewFaculty = (courseId) => {
      navigate(`/admindashboard/admincoursefaculty?courseId=${courseId}`);
      //console.log(courseId);
    };
    

  return (
    <div className={classes.container}>
      <div>
      <Typography variant="h4" align="center">
          Course Details
        </Typography>
      </div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="course table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(student) && student.length > 0 ? (
              student.map((course, index) => (
                <TableRow key={index}>
                  <TableCell>{course.Id}</TableCell>
                  <TableCell>{course.CourseCode}</TableCell>
                  <TableCell>{course.CourseName}</TableCell>
                  <TableCell className={classes.actionButtons}>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => handleViewFaculty(course.Id)}
                  >
                  View Faculty
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => handleViewStudent(course.Id)}
                  >
                  View Student
                  </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>Loading or empty data...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <br/>
      <Button variant="contained" color="secondary" onClick={() => setIsDialogOpen(true)}>
        Add Course
      </Button>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent className={classes.dialog}>
          <TextField
            label="Course Code"
            fullWidth
            margin="normal"
            value={newCourse.courseCode}
            onChange={(e) => setNewCourse({ ...newCourse, courseCode: e.target.value })}
          />
          <TextField
            label="Course Name"
            fullWidth
            margin="normal"
            value={newCourse.courseName}
            onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Close
          </Button>
          <Button onClick={handleAddCourse} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {successMessage && (
        <Typography
        variant="body1"
        color="primary"
        align="center"
        style={{ marginTop: '20px' }}
        >
        {successMessage}
        </Typography>
        )}
    </div>
  )
}

export default AdminCourseDisplay