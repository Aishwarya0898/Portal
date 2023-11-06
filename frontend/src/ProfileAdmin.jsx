import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Snackbar,
} from '@material-ui/core';

function ProfileAdmin() {
  const id = localStorage.getItem('userId');
  const [student, setStudent] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    axios
      .get(`http://127.0.0.1:3000/getAdmin?userId=${id}`)
      .then((res) => setStudent(res.data.Result[0]))
      .catch((err) => console.log(err));
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsProfileSaved(false);
    setError(null);
  };

  const handleSaveProfile = () => {
    axios
      .put(`http://127.0.0.1:3000/updateAdminProfile?id=${id}`, student)
      .then(res => {
        if(res.Result.affectedRows === 1){
          setSuccessMessage('Profile Saved Successfully!');
          setStudent(res.data.Result[0]);
          setIsEditing(false);
          setIsProfileSaved(true);
        } else {
            alert("Error");
            console.log(console.error());
        }
    })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  return (
    <Container maxWidth='sm' style={{ marginTop: '20px' }}>
      <Card>
        <CardHeader title='My Profile' />
        <CardContent>
          <TextField
            fullWidth
            label='Name'
            name='Name'
            value={student.Name || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label='Admin Id'
            name='UIN'
            value={student.UIN || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label='DOB'
            name='DOB'
            value={student.DOB || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label='Phone'
            name='Phone'
            type='number'
            value={student.Phone || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label='Email'
            name='Email'
            type='email'
            value={student.Email || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          {isEditing ? (
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: '20px', marginRight: '10px' }}
              onClick={handleSaveProfile}
            >
              Save Profile
            </Button>
          ) : (
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: '20px', marginRight: '10px' }}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          )}
          <Button
            variant='contained'
            color='secondary'
            style={{ marginTop: '20px' }}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          {successMessage && (
          <Typography
            variant="body1"
            align="center"
            color="success"
            style={{ marginTop: '20px' }}
            open={isProfileSaved}
          >
          {successMessage}
          </Typography>
        )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProfileAdmin;
