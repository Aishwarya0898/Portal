import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Container, Box, Typography, Divider, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

const styles = {
  box: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  content: {
    fontSize: '18px',
  },
  divider: {
    margin: '20px 0',
  },
  button: {
    marginTop: '20px',
    justifyContent: 'center'
  }
};																											

function TeacherHome() {
  
  const navigate = useNavigate();
  const Name = localStorage.getItem('Name');
  const Phone = localStorage.getItem('Phone');
  const Email = localStorage.getItem('Email');
  const Id = localStorage.getItem('userId');										  								
  const [totalCount, setTotalCount] = useState([]);
  //const [totalCount, setTotalCount] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
								  
  useEffect(() => {
    axios.defaults.withCredentials = true;	 
    axios.get('http://127.0.0.1:3000/teacherdashboard/home')
      .then(res => {
        if (res.data.Status === "Success") {
          console.log(res.data);
        } else {
			
          navigate('/login');
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        // Handle the error gracefully, e.g., navigate to an error page or show an error message.
      });
  }, []);

  useEffect(() => {
    axios.get(`http://127.0.0.1:3000/getFacultyCourseCount?Id=${Id}`)
      .then(res => {
        setTotalCount(res.data.Result[0].Total)
        console.log(res.data)
      })
      .catch(err => console.log(err));
  }, []); 
  
  return(
  <Container maxWidth='md'>
    <Box style={styles.box}>
      <Typography variant='h4' style={styles.title}>
        Welcome, Faculty
      </Typography>
      <Divider style={styles.divider} />
      <Typography variant='body1' style={styles.content}>
        {Name}
      </Typography>
    </Box>
    <Box style={styles.box}>
      <Typography variant='h4' style={styles.title}>
        Number of Courses
      </Typography>
      <Divider style={styles.divider} />
      <Typography variant='body1' style={styles.content}>
        Total: {totalCount}
      </Typography>
    </Box>
    <Button variant='contained' color='primary' style={styles.button} onClick={handleDialogOpen}>
        View Details
      </Button>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
        <Typography variant='body1'>
      <strong>Name:</strong> {Name}
				
    </Typography>
    <Typography variant='body1'>
      <strong>ID:</strong> {Id}
    </Typography>
    <Typography variant='body1'>
      <strong>Phone:</strong> {Phone}
    </Typography>
    <Typography variant='body1'>
      <strong>Email:</strong> {Email}
    </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  
  )
  
}

export default TeacherHome;

						