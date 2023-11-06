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

function ViewCourseDetailsStudent() {
    const { courseId } = useParams();
	  const Id = localStorage.getItem('userId');
    const [discussionThread, setDiscussionThread] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    //const [CourseResponse, setCourseResponse] = useState([]);
    //const [response, setResponse] = useState('');
    //const [studentresponse, setStudentResponse] = useState('');
    //const [isEditing, setIsEditing] = useState(false);
	

    const fetchCourseDiscussion = () => {
      axios
        .get(`http://127.0.0.1:3000/getDiscussionThreadStudent?courseId=${courseId}`)
        .then((res) => {
          console.log(res.data); // Log the response data to the console
          setDiscussionThread(res.data.Result);
        })
        .catch((err) => console.log(err));
    };
    
    

    useEffect(() => {
      fetchCourseDiscussion(); // Fetch student courses when the page is initially loaded
    }, [courseId]);

    
	
	
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
            <Link to={`/studentdashboard/viewstudentdiscussionthread?courseId=${courseId}&discussionHeading=${thread.DiscussionHeading}`}>{thread.DiscussionHeading}</Link>
          </li>
          ))}
        </ul>
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

export default ViewCourseDetailsStudent