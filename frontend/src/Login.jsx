import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './style.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Typography, Container, Paper, Link, } from '@mui/material';
import { useCookies } from 'react-cookie';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState({
        email:'',
        password:''
    })

    const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
    };
  
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://127.0.0.1:3000/Login', values)
        .then(res => {
            console.log(res.data.Status)
            if(res.data.Status === "Success"){
                const userRole = res.data.RoleId;
                console.log(res.data)
                const Id = res.data.Id;
                localStorage.setItem('userId', Id);
                const Name = res.data.Name;
                console.log(Name)
                localStorage.setItem('Name', Name);
                const Phone = res.data.Phone;
                localStorage.setItem('Phone', Phone);
                const Email = res.data.Email;
                localStorage.setItem('Email', Email);
                if (userRole === 1) {
                    navigate('/studentdashboard/home/'); //navigate(`/studentdashboard/home?id={id}`);
                  } else if (userRole === 2) {
                    navigate('/teacherdashboard/home');
                  } else if (userRole === 3) {
                    navigate('/admindashboard/home');
                  } else {
                    navigate('/dashboard');
                  }
            } else {
                alert("Error");
            }
        })
        .then(err => console.log(err));
    }

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      setIsVisible(true);
    }, []);

    
  return (
    <Container maxWidth="sm">
      <br/>
      <Typography
      variant='h4'
      align='center'
      mb={3}
      style={{
        color: 'white',
        backgroundImage: 'linear-gradient(to right, rgb(44 54 66), rgb(112 193 217))',
        fontFamily: 'monospace',
        padding: '10px',
        textShadow: '2px 2px 4px #fff',
        borderRadius: '8px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <strong>University Portal</strong>
      </Typography>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
        <Typography  align='center' mb={3} style={{fontSize: 'xx-large', fontFamily: 'fantasy'}}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label='Email'
            placeholder='Enter Email'
            name='email'
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
      label='Password'
      type={showPassword ? 'text' : 'password'}
      placeholder='Enter Password'
      name='password'
      value={values.password}
      onChange={(e) => setValues({ ...values, password: e.target.value })}
      sx={{ mb: 2 }}
      InputProps={{
        endAdornment: (
          <IconButton onClick={handlePasswordToggle} edge="end" style={{ paddingTop: '5px', paddingRight: '10px', paddingBottom: '5px', paddingLeft: '10px'}}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        ),
            }}
          />
          <Button variant='contained' fullWidth color='success' type='submit' sx={{ mb: 2 }}>
            Login
          </Button>
          <Button variant='contained' fullWidth color='success' href='/' sx={{ mb: 2 }}>
            Cancel
          </Button>
        </form>
        <Typography variant='body1' align='center'>
          Create an Account <Link href='/register'>Register</Link>
        </Typography>
      </Paper>
    </Container>
  )
}

export default Login