import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Select, MenuItem, FormControl,InputLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Register() {

  const initialFormValues = {
    name: '',
    uin: '',
    dob: '',
    phone: '',
    roleId:'',
    email: '',
    password: ''
  };
    const [values, setValues] = useState(initialFormValues)
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState('');


    const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://127.0.0.1:3000/register', values)
        .then(res => {
            if(res.data.Status === "Success"){
              setSuccessMessage('Registered successfully! You can now login with your credentials.');
              setValues(initialFormValues);
            } else {
                alert("Error");
                console.log(console.error());
            }
        })
        .then(err => console.log(err));
    }

   return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                name="name"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="UIN"
                fullWidth
                name="uin"
                value={values.uin}
                onChange={(e) => setValues({ ...values, uin: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                name="dob"
                value={values.dob}
                onChange={(e) => setValues({ ...values, dob: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                fullWidth
                name="phone"
                value={values.phone}
                onChange={(e) => setValues({ ...values, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>RoleId</InputLabel>
                <Select
                label="RoleId"
                value={values.roleId}
                onChange={(e) => setValues({ ...values, roleId: e.target.value })}
                >
                <MenuItem value={1}>1</MenuItem>
                <em>Student</em>
                <br/>
                <MenuItem value={2}>2</MenuItem>
                <em>Teacher</em>
                <br/>
                <MenuItem value={3}>3</MenuItem>
                <em>Admin</em>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                name="email"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Register
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            style={{ marginTop: '10px' }}
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </form>
        {successMessage && (
          <Typography
            variant="body1"
            align="center"
            color="success"
            style={{ marginTop: '20px' }}
          >
            {successMessage}
          </Typography>
        )}
        <Typography variant="body1" align="center" style={{ marginTop: '20px' }}>
          Already have an Account? <a href="/login">Login</a>
        </Typography>
      </Paper>
    </Container>
   )
}

export default Register