import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
//import { useNavigate } from 'react-router-dom'
import axios from 'axios'
//import { useCookies } from 'react-cookie';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
  } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

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
  }));

function AdminCourseStudent() {

    const [student, setStudent] = useState([]);
    const location = useLocation();
    const courseId = new URLSearchParams(location.search).get('courseId');
    const classes = useStyles();

    useEffect(() => {
        axios
          .get(`http://127.0.0.1:3000/getAdminStudentCourse?courseId=${courseId}`)
          .then((res) => setStudent(res.data.Result))
          .catch((err) => console.log(err));
      }, [courseId]);

  return (
    <div className={classes.container}>
      <div>
      <Typography variant="h4" align="center">
          Student Details
        </Typography>
      </div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="course table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>UIN</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(student) && student.length > 0 ? (
              student.map((students, index) => (
                <TableRow key={index}>
                  <TableCell>{students.Id}</TableCell>
                  <TableCell>{students.Name}</TableCell>
                  <TableCell>{students.UIN}</TableCell>
                  <TableCell>{students.Email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No User under this particular course</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default AdminCourseStudent