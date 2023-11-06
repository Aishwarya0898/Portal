import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

const styles = {
  container: {
    marginTop: '20px',
    alignItems: 'center',
  },
  card: {
    padding: '20px',
    alignItems: 'center',
    flexDirection: 'column',
    display:'flex'
  },
  formInput: {
    marginBottom: '20px',
  },
  button: {
    marginTop: '20px',
    marginBottom: '20px', // Add bottom margin for spacing
    textAlign: 'center', // Center text inside the button
  },
  dialog: {
    paddingTop: '16px',    // Top padding
    paddingRight: '20px',  // Right padding
    paddingBottom: '16px', // Bottom padding
    paddingLeft: '20px',
  },
};

function ViewCourseDetailsFaculty() {
  const { courseId } = useParams();
  const Id = localStorage.getItem('userId');
  const [discussionThread, setdiscussionThread] = useState([]);
  const [addDiscussionThread, setaddDiscussionThread] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newThread, setNewThread] = useState({ DiscussionHeading: ''});
  //const [studentDetails, setStudentDetails] = useState([]);

  const fetchDiscussionThreads = () => {
    axios
      .get(`http://127.0.0.1:3000/getDiscussionThreads?courseId=${courseId}&Id=${Id}`)
      .then((res) => setdiscussionThread(res.data.Result))
      .catch((err) => console.log(err));
  };
  

  useEffect(() => {
    fetchDiscussionThreads(); 
  }, [courseId, Id]);



  const handleAddDisussion = (event) => {
    event.preventDefault();
    axios.post(`http://127.0.0.1:3000/addDiscussionThreads?courseId=${courseId}&Id=${Id}`, {
      DiscussionHeading: newThread.DiscussionHeading
    })
      .then(res => {
        if (res.data.Status === "Success") {
          setSuccessMessage('Discussion Thread Created successfully!');
          // Update the student state to include the new course
          setdiscussionThread(prevThreads => [...prevThreads, newThread]);
          setIsDialogOpen(false); // Close the dialog
        } else {
          alert("Error");
          console.log(console.error());
        }
      })
      .catch(err => console.error(err));
  };
  
  
  

return (
  <Container maxWidth='md' style={styles.container}>
    <Card variant="outlined" style={styles.card}>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Discussion Threads
        </Typography>
        <ul>
          {discussionThread.map(thread => (
          <li key={thread.DiscussionHeading} style={{ fontSize: '20px' }}>
            <Link to={`/teacherdashboard/viewfacultydiscussionthread/${thread.DiscussionHeading}`}>{thread.DiscussionHeading}</Link>
          </li>
          ))}
        </ul>
        <Button variant="contained" color="secondary" align="center" onClick={() => setIsDialogOpen(true)}>
          Add New Discussion Thread
        </Button>
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add New Discussion</DialogTitle>
        <DialogContent className={styles.dialog}>
          <TextField
            label="Discussion Heading"
            fullWidth
            margin="normal"
            value={newThread.DiscussionHeading}
            onChange={(e) => setNewThread({ ...newThread, DiscussionHeading: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Close
          </Button>
          <Button onClick={handleAddDisussion} color="primary" variant="contained">
            Create
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
      </CardContent>
    </Card>
  </Container>
)
}

export default ViewCourseDetailsFaculty