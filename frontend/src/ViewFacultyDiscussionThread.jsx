import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@material-ui/core';

const styles = {
  container: {
    marginTop: '20px',
  },
  card: {
    padding: '20px',
  },
  formInput: {
    marginBottom: '20px',
  },
  button: {
    marginTop: '20px',
    marginRight: '10px',
  },
};

function ViewFacultyDiscussionThread() {
    const { threadDiscussionHeading } = useParams();
    const { courseId } = useParams();
    const [CourseDiscussion, setCourseDiscussion] = useState({ Discussion: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isProfileSaved, setIsProfileSaved] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
    const [isCancelButtonVisible, setIsCancelButtonVisible] = useState(false);
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
    const [error, setError] = useState(null);
    const [studentresponses, setStudentResponses] = useState('');
    //const [isFeedbackFormVisible, setIsFeedbackFormVisible] = useState(false);
    //const [isTextFieldVisible, setIsTextFieldVisible] = useState(false);
    const [selectedResponseId, setSelectedResponseId] = useState(null);
    const [feedback, setFeedback] = useState('');
    


    const fetchCourseDiscussion = () => {
      axios
        .get(`http://127.0.0.1:3000/getThreadResponse?thread=${threadDiscussionHeading}`)
        .then((res) => {
          //console.log(res.data.Result); // Check the structure of the response
          setCourseDiscussion(res.data.Result[0]);
        })        
        .catch((err) => console.log(err));
    };
    
  
    useEffect(() => {
      fetchCourseDiscussion(); // Fetch student courses when the page is initially loaded
    }, [threadDiscussionHeading]);


    const fetchResponseThread = () => {
      axios
        .get(`http://127.0.0.1:3000/getStudentThreadResponse?threadHeading=${threadDiscussionHeading}`)
        .then((res) => {
          //console.log(res.data); // Check the structure of the response
          setStudentResponses(res.data.Result);
        })        
        .catch((err) => console.log(err));
    };

    useEffect(() => {
      fetchResponseThread(); // Fetch response thread when the page is initially loaded
    }, [threadDiscussionHeading]);

    const handleEditClick = () => {
      setIsEditing(true);
      setIsProfileSaved(false);
      setIsSaveButtonVisible(true);
      setIsCancelButtonVisible(true);
    };
  
    const handlePostDiscussion = () => {
      axios
        .put(`http://127.0.0.1:3000/updateThreadResponse?response=${threadDiscussionHeading}`, CourseDiscussion)
        .then(res => {
          if(res.data.Status === 'Success'){
            setCourseDiscussion(res.data.Result);
            setIsEditing(false);
            setIsProfileSaved(true);
            setSuccessMessage('Discussion Thread Updated successfully!');
            setIsSaveButtonVisible(false);
            setIsCancelButtonVisible(false);
            fetchCourseDiscussion();
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
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCourseDiscussion({ ...CourseDiscussion, [name]: value });
    };

    const handleFeedback = (responseID) => {
      //console.log("ID: ", responseID);
      //setIsFeedbackFormVisible(true);
      axios
        .put(`http://127.0.0.1:3000/updateFacultyFeedback?ID=${responseID}`, {feedback})
        .then(res => {
          if(res.data.Status === 'Success'){
            //console.log("Feedback updated successfully")
            setSuccessMessage('Feedback Updated successfully!');
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
          setSelectedResponseId(null);
          setFeedback('');
        });
    };
    

    const handleDeleteResponse = (responseID) => {
      //console.log("Id: ", responseID)
      axios
        .put(`http://127.0.0.1:3000/deleteFacultyStudentResponse?ID=${responseID}`)
        .then(res => {
          if(res.data.Status === 'Success'){
            //console.log("Feedback updated successfully")
            setSuccessMessage('Student Response deleted successfully!');
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
    


  return (
    <Container maxWidth='md' style={styles.container}>
      <Card variant="outlined" align="center" style={styles.card}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Posted Discussion
          </Typography>
          <TextField
            fullWidth
            name='Discussion'
            type='text'
            value={CourseDiscussion.Discussion || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            style={styles.formInput}
          />
          {isEditing && isSaveButtonVisible && (
            <Button
              variant='contained'
              color='primary'
              style={styles.button}
              onClick={handlePostDiscussion}
            >
              Post Discussion
            </Button>
          )}
          {isEditing && isCancelButtonVisible && (
          <Button
            variant='contained'
            color='secondary'
            style={styles.button}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          )}
          {!isEditing && (
            <Button
              variant='contained'
              color='primary'
              style={styles.button}
              onClick={handleEditClick}
              align='center'
            >
              Edit Discussion
            </Button>
          )}
          {isSuccessMessageVisible && (
          <Typography
            variant="body1"
            align="center"
            color="success"
            style={{ marginTop: '20px' }}
          >
            {successMessage}
          </Typography>
          )}
        </CardContent>
      </Card>
      <CardContent style={styles.card} align="center">
        <Typography variant="h4" align="center">
          Responses
        </Typography>
        <br />
        {studentresponses.length > 0 ? (
        <div style={styles.responseContainer}>
          {studentresponses.map((response) => (
            <Card key={response.Id} style={styles.responseCard}>
              <CardContent>
                <Typography variant="h6" align="center" component="div">
                  <strong>Name:</strong> {response.StudentName}
                </Typography>
                <Typography variant="body1" align="center" component="div">
                  <strong>Response:</strong> {response.Response}
                </Typography>
                <Typography variant="body1" align="center" component="div">
                  <strong>Your FeedBack:</strong> {response.FacultyFeedback}
                </Typography>
                <br />
                {selectedResponseId === response.ID ? (
                  <div>
												
                    <TextField
                      fullWidth
                      label="Feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      style={styles.formInput}
                    />
				 
                    <Button onClick={() => handleFeedback(response.ID)} color="primary">
                      Submit
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedResponseId(null);
													   
                        setFeedback('');
                      }}
                      color="primary"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={() => {
                        setSelectedResponseId(response.ID);
													
                      }}
                      color="primary"
                      variant="contained"
                      align="right"
                      style={{ marginRight: '10px' }}
                    >
                      Give/Update Feedback
                    </Button>
                    <Button
                      onClick={() => handleDeleteResponse(response.ID)}
                      color="secondary"
                      variant="contained"
                      align="right"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>No responses available.</div>
      )}
      </CardContent>
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
    </Container>
  )
}

export default ViewFacultyDiscussionThread