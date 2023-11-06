//import { useState } from 'react'
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './login'
import Home from './Home';
import Register from './Register';
import Studentdashboard from './studentdashboard';
import Dashboard from './dashboard';
import Teacherdashboard from './Teacherdashboard';
import Admindashboard from './Admindashboard';
import ViewCoursesStudent from './ViewCoursesStudent';
import ProfileStudent from './ProfileStudent';
import StudentHome from './StudentHome';
import ViewCoursesTeacher from './ViewCoursesTeacher';
import TeacherHome from './TeacherHome';
import ProfileTeacher from './ProfileTeacher';
import ViewFacultyAdmin from './ViewFacultyAdmin';
import AdminHome from './AdminHome';
import ProfileAdmin from './ProfileAdmin';
import AdminViewStudent from './AdminViewStudent';
import AdminViewFaculty from './AdminViewFaculty';
import AdminViewAdmin from './AdminViewAdmin';
import AdminViewCourseStudent from './AdminViewCourseStudent';
//import AdminInsertStudent from './AdminInsertStudent';
import AdminViewCourseFaculty from './AdminViewCourseFaculty';
//import AdminInsertFaculty from './AdminInsertFaculty';
//import AdminInsertAdmin from './AdminInsertAdmin';
import AdminInsertUser from './AdminInsertUser';
import AdminCourseDisplay from './AdminCourseDisplay';
import AdminCourseStudent from './AdminCourseStudent';
import AdminCourseFaculty from './AdminCourseFaculty';
import ViewCourseDetailsFaculty from './ViewCourseDetailsFaculty';
import ViewCourseDetailsStudent from './ViewCourseDetailsStudent';
import ViewFacultyDiscussionThread from './ViewFacultyDiscussionThread';
import ViewStudentDiscussionThread from './ViewStudentDiscussionThread';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/Login" element={<Login />}></Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/studentdashboard" element={<Studentdashboard />}>
        <Route path='/studentdashboard/home/' element={<StudentHome />} />
        <Route path='/studentdashboard/viewcoursesstudent' element={<ViewCoursesStudent />} />
        <Route path='/studentdashboard/profilestudent' element={<ProfileStudent />} />
        <Route path='/studentdashboard/viewcoursedetailsstudent/:courseId' element={<ViewCourseDetailsStudent />} />
        <Route path='/studentdashboard/viewstudentdiscussionthread' element={<ViewStudentDiscussionThread />} />
      </Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="/teacherdashboard" element={<Teacherdashboard />}>
        <Route path='/teacherdashboard/home' element={<TeacherHome />} />
        <Route path='/teacherdashboard/viewcoursesteacher' element={<ViewCoursesTeacher />} />
        <Route path='/teacherdashboard/profileteacher' element={<ProfileTeacher />} />
        <Route path='/teacherdashboard/viewcoursedetailsFaculty/:courseId' element={<ViewCourseDetailsFaculty />} />
        <Route path='/teacherdashboard/viewfacultydiscussionthread/:threadDiscussionHeading' element={<ViewFacultyDiscussionThread />} />
      </Route>
      <Route path="/admindashboard" element={<Admindashboard />}>
        <Route path='/admindashboard/home' element={<AdminHome />} />
        <Route path='/admindashboard/viewfacultyadmin' element={<ViewFacultyAdmin />} />
        <Route path='/admindashboard/profileadmin' element={<ProfileAdmin />} />
        <Route path='/admindashboard/adminviewstudent' element={<AdminViewStudent />} />
        <Route path='/admindashboard/adminviewfaculty' element={<AdminViewFaculty />} />
        <Route path='/admindashboard/adminviewadmin' element={<AdminViewAdmin />} />
        <Route path='/admindashboard/adminviewcoursestudent' element={<AdminViewCourseStudent />} />
        <Route path='/admindashboard/insertuser' element={<AdminInsertUser />} />
        <Route path='/admindashboard/adminviewcoursefaculty' element={<AdminViewCourseFaculty />} />
        <Route path='/admindashboard/admincoursedisplay' element={<AdminCourseDisplay />} />
        <Route path='/admindashboard/admincoursestudent' element={<AdminCourseStudent />} />
        <Route path='/admindashboard/admincoursefaculty' element={<AdminCourseFaculty />} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
