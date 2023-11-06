import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
//import { useNavigate } from 'react-router-dom'
import axios from 'axios'
//import { useCookies } from 'react-cookie';
import { Box, Select, MenuItem, InputLabel, FormControl, Typography, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Paper, Modal, Button, Checkbox, TextField} from '@mui/material';
import { useLocation } from 'react-router-dom';

function AdminViewCourseStudent() {

    const [student, setStudent] = useState([]);
    const location = useLocation();
    const courseId = new URLSearchParams(location.search).get('studentId');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseCodes, setCourseCodes] = useState([]);
    const [courseNames, setCourseNames] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const initialFormValues = {
      CourseCode: '',
      courseName: ''
    };
    const [values, setValues] = useState(initialFormValues)
	  const [selectedCourses, setSelectedCourses] = useState([]);	
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);													   

    const fetchStudentCourses = () => {
      axios
        .get(`http://127.0.0.1:3000/getAdminStudentCourses?courseId=${courseId}`)
        .then((res) => setStudent(res.data.Result))
        .catch((err) => console.log(err));
    };
    

    useEffect(() => {
      fetchStudentCourses(); // Fetch student courses when the page is initially loaded
    }, [courseId]);

      useEffect(() => {
        axios.get('http://127.0.0.1:3000/getCourses')
          .then((res) => {
            if (res.data.Result && Array.isArray(res.data.Result)) {
              const codes = res.data.Result.map(course => course.CourseCode);
              const names = res.data.Result.map(course => course.CourseName);
              setCourseCodes(codes);
              setCourseNames(names);
            } else {
              console.error('Invalid API response format');
            }
          })
          .catch((error) => console.error(error));
      }, []);

      const handleAddCourse = () => {
        setIsModalOpen(true);
      };
    
      const handleModalClose = () => {
        setIsModalOpen(false);
      };
    
      const handleRegisterCourse = (event) => {
        event.preventDefault();
        axios.post('http://127.0.0.1:3000/addCourseStudent',{
          courseId: courseId,
          coursename: values.courseName
        })
        .then(res => {
            if(res.data.Status === "Success"){
              setSuccessMessage(res.data.message);
              setValues(initialFormValues);
              setIsModalOpen(false);
              fetchStudentCourses();
            } else if (res.data.Status === "Error") {
              // Handle error message (if needed)
              alert(res.data.message); // Show error message in an alert
              console.error(res.data.message); // Log error message to the console
          }
        })
        .then(err => console.log(err)); 
      };
	  
	  const handleCheckboxChange = (courseCode) => {
      setSelectedCourses((prevSelectedCourses) => {
        if (prevSelectedCourses.includes(courseCode)) {
          return prevSelectedCourses.filter((code) => code !== courseCode);
        } else {
          return [...prevSelectedCourses, courseCode];
        }
      });
    };

    const confirmDropCourses  = () => {
      setIsConfirmationDialogOpen(true);
    };

    const handleDropCourse = () => {
      axios
        .delete(`http://127.0.0.1:3000/dropCoursesStudent`, {
          data: {
            studentId: courseId, // Provide the appropriate student ID
            courseCodes: selectedCourses
          }
        })
        .then((res) => {
          // Handle the API response (success or error)
          fetchStudentCourses(); // Refresh the course list after dropping the courses
          setSelectedCourses([]); // Clear the selected courses after dropping
        })
        .catch((error) => {
          console.error(error);
          // Handle error, if needed
        });
        setIsConfirmationDialogOpen(false);
    };

	

  return (
    <Box p={3} display="flex" justifyContent="center" mt={3}>
      <Paper elevation={3} style={{ width: '50%', padding: '20px' }}>
        <Typography variant="h4" align="center" mb={3}>
          Courses Registered
        </Typography>
        <br />
        <Box display="flex" flexDirection="column" alignItems="center">
          {student.map((students, index) => (
            <Paper key={index} elevation={1} style={{ padding: '10px', margin: '5px 0', borderRadius: '5px' }}>
				<Checkbox
                checked={selectedCourses.includes(students.CourseCode)}
                onChange={() => handleCheckboxChange(students.CourseCode)}
              />
              {students.CourseCode} - {students.courseName}
            </Paper>
          ))}
		  <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>																			
          <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: 'auto' }}
          onClick={handleAddCourse}
          >
            Add Course
          </Button>
		      <Button
            variant="contained"
            style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white'}}
            onClick={confirmDropCourses}
          >
            Drop Course
          </Button>
          </div>	
        </Box>
        <Modal open={isModalOpen} onClose={handleModalClose}>
          <Box
            sx={{
              position: 'absolute',
              width: 400,
              bgcolor: 'background.paper',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 24,
              p: 4,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add Course
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="courseName">Course Name</InputLabel>
              <Select
              value={values.courseName}
              onChange={(e) => setValues({ ...values, courseName: e.target.value })}
              label="Course Name"
              inputProps={{
                id: 'courseName',
              }}
              >
                {courseNames && courseNames.map((name) => (
                <MenuItem key={name} value={name}>
                {name}
                </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegisterCourse}
              style={{ marginTop: '20px' }}
            >
              Register
            </Button>
          </Box>
        </Modal>
        <Dialog open={isConfirmationDialogOpen} onClose={() => setIsConfirmationDialogOpen(false)}>
          <DialogTitle>Confirm</DialogTitle>
            <DialogContent>
              <Typography variant="body1">Are you sure you want to drop the selected courses?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setIsConfirmationDialogOpen(false);
                setSelectedCourses([]);
              }} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleDropCourse(courseId, student.CourseCode)} color="primary">
                Confirm
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
      </Paper>
    </Box>
  )
}

export default AdminViewCourseStudent