import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios'
import {
  Container,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './style.css'

const styles = {
  container: {
    marginTop: '20px',
  },
  card: {
    marginBottom: '20px',
    maxWidth: '1000px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonGroup: {
    display: 'flex',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    tableLayout: 'auto',
    //width: '1200px',
  },
};



function ViewStudentDiscussionThread() {
    //const { threadDiscussionHeading } = useParams();
    //const { courseId } = useParams();
    const Name = localStorage.getItem('Name');
    const SId = localStorage.getItem('userId');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const courseId = searchParams.get('courseId');
    const threadDiscussionHeading = searchParams.get('discussionHeading');
    const [discussionThread, setDiscussionThread] = useState({ Discussion: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isProfileSaved, setIsProfileSaved] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogResponse, setDialogResponse] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
    const [isCancelButtonVisible, setIsCancelButtonVisible] = useState(false);
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
    const [error, setError] = useState(null);
    const [studentresponses, setStudentResponses] = useState('');
    const [editMode, setEditMode] = useState(null); // Track the response ID being edited
    const [editedResponse, setEditedResponse] = useState('');


    const fetchDiscussionThread = () => {
      axios
        .get(`http://127.0.0.1:3000/getThreadDiscussionStudent?thread=${threadDiscussionHeading}`)
        .then((res) => {
          //console.log(res.data.Result); // Check the structure of the response
          setDiscussionThread(res.data.Result[0]);
        })        
        .catch((err) => console.log(err));
    };
    
  
    useEffect(() => {
      fetchDiscussionThread(); // Fetch discussion thread when the page is initially loaded
    }, [threadDiscussionHeading]);

    const fetchResponseThread = () => {
      axios
        .get(`http://127.0.0.1:3000/getStudentThreadResponse?threadHeading=${threadDiscussionHeading}&courseId=${courseId}&SId=${SId}`)
        .then((res) => {
          //console.log(res.data); // Check the structure of the response
          setStudentResponses(res.data.Result);
        })        
        .catch((err) => console.log(err));
    };

    useEffect(() => {
      fetchResponseThread(); // Fetch response thread when the page is initially loaded
    }, [threadDiscussionHeading, courseId, SId]);

    //console.log("studentresponses:", studentresponses);

    

      const handleDialogOpen = () => {
        setIsDialogOpen(true);
      };
    
      const handleDialogClose = () => {
        setIsDialogOpen(false);
      };

      const handleEdit = (responseID) => {
        setEditMode(responseID);
        // Set the edited response text based on the responseID
        const responseToEdit = studentresponses.find((response) => response.ID === responseID);
        setEditedResponse(responseToEdit.Response);
      };
      

      const handleDelete = (responseID) => {
        axios
        .put(`http://127.0.0.1:3000/deleteStudentResponse?ID=${responseID}`)
        .then(res => {
          if(res.data.Status === 'Success'){
            //console.log("Feedback updated successfully")
            setIsSuccessMessageVisible('Student Response deleted successfully!');
            fetchResponseThread();
          } else {
              alert("Error");
              console.error(res.data.Result);
          }
        })
        .catch((err) => {
          setError(err);
          console.log(err);
        });
      };

      const handleCancelEdit = () => {
        setEditMode(null);
        setEditedResponse('');
      };
      
      const handleUpdate = (responseID) => {
        axios
        .put(`http://127.0.0.1:3000/updateEditedStudentResponse?ID=${responseID}`, {editedResponse})
        .then(res => {
          if(res.data.Status === 'Success'){
            //console.log("Feedback updated successfully")
            setSuccessMessage('Response Updated successfully!');
            fetchResponseThread();
          } else {
              alert("Error");
              console.error(res.data.Result);
          }
        })
        .catch((err) => {
          setError(err);
          console.log(err);
        })
        .finally(() => {
          setEditMode(null);
          setEditedResponse('');
        });
        // Implement logic to update the response text in your data source using API call or state management
        // After updating, exit edit mode
      };
    
      const handleResponseSubmit = () => {
        axios
        .post(`http://127.0.0.1:3000/addNewThreadResponse?threadHeading=${threadDiscussionHeading}&courseId=${courseId}&SId=${SId}`, {dialogResponse})
        .then(res => {
          if(res.data.Status === 'Success'){
            setCourseDiscussion(res.data.Result);
            fetchCourseDiscussion();
            setIsEditing(false);
            setIsProfileSaved(true);
            setSuccessMessage(res.data.message);
            setIsSaveButtonVisible(false);
            setIsCancelButtonVisible(false);
          } else {
              alert("Error");
              console.error(res.data.Result);
          }
      })
        .catch((err) => {
          setError(err);
          console.log(err);
        });
        // Handle dialog submit logic here
        // You can use dialogResponse state to access the response input value
        // ...
        // Close the dialog after submission
        setIsDialogOpen(false);
      };

  

    useEffect(() => {
      //console.log('isProfileSaved:', isProfileSaved);
      if (isProfileSaved) {
        setIsSuccessMessageVisible(true);
    
        // Automatically hide the success message after a certain time (e.g., 3 seconds)
        const timer = setTimeout(() => {
          setIsSuccessMessageVisible(false);
        }, 5000);
    
        // Clear the timer when the component is unmounted or when isProfileSaved changes
        return () => clearTimeout(timer);
      }
    }, [isProfileSaved]);

  return (
    <Container maxWidth='md' style={styles.container}>
    <Card variant="outlined" style={styles.card}>
      <br/>
      <Typography variant="h5" align="center" gutterBottom>
        <strong>Posted Discussion</strong>
      </Typography>
      <CardContent>
        <Typography variant="h5" align="center" >
          {discussionThread.Discussion}
        </Typography>
      </CardContent>
    </Card>

    <Card variant="outlined" style={styles.card}>
      <CardContent style={styles.card} align="center">
        <Typography variant="h4" align="center">
          Responses
        </Typography>
        <br />
        {studentresponses.length > 0 ? (
        <TableContainer style={styles.tableContainer}>
          <Table style={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Response</strong></TableCell>
                <TableCell><strong>Faculty Feedback</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {studentresponses.map((response) => (
  <TableRow key={response.ID}>
    <TableCell>{response.StudentName}</TableCell>
    <TableCell>
      {editMode === response.ID ? (
        <TextField
          fullWidth
          value={editedResponse}
          onChange={(e) => setEditedResponse(e.target.value)}
        />
      ) : (
        response.Response
      )}
    </TableCell>
    <TableCell>{response.FacultyFeedback}</TableCell>
    <TableCell>
      {response.StudentName === Name && (
        <div style={styles.buttonGroup}>
          {editMode === response.ID ? (
            <>
              <Button onClick={() => handleUpdate(response.ID)} color="primary" variant="contained" style={{ marginRight: '10px' }}>
                Update
              </Button>
              <Button onClick={() => handleCancelEdit()} color="primary" variant="contained">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => handleEdit(response.ID)} color="primary" variant="contained" style={{ marginRight: '10px' }}>
                Edit
              </Button>
              <Button onClick={() => handleDelete(response.ID)} color="secondary" variant="contained">
                Delete
              </Button>
            </>
          )}
        </div>
      )}
    </TableCell>
  </TableRow>
))}
            </TableBody>
          </Table>
        </TableContainer>
        ) : (
        <div>No responses available.</div>
        )}
        <br />
        <Button variant="outlined"  color="primary" align="center" onClick={handleDialogOpen}>
          Add New Response
        </Button>
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Add New Response</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label='Your Response'
              name='Response'
              type='text'
              value={dialogResponse}
              onChange={(e) => setDialogResponse(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleResponseSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
      {isSuccessMessageVisible && (
        <Typography
        variant="body1"
        color="primary"
        align="center"
        style={{ marginTop: '20px' }}
        >
        {isSuccessMessageVisible}
        </Typography>
        )}
    </Container>
  )
}

export default ViewStudentDiscussionThread