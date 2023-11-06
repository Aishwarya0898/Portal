import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Select, MenuItem, FormControl,InputLabel } from '@mui/material';


function AdminInsertUser() {

  const initialFormValues = {
    name: '',
    uin: '',
    dob: '',
    phone: '',
    email: '',
    roleId:''
  };
    const [values, setValues] = useState(initialFormValues)

    const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://127.0.0.1:3000/adminInsertUser', values)
        .then(res => {
            if(res.data.Status === "Success"){
              setSuccessMessage('User Inserted successfully!');
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
      <Typography variant="h4" align="center" gutterBottom>
          User Details
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
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Insert
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
      
    </Container>
   )
}

export default AdminInsertUser