import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminViewAdmin() {
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);								 
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  //const navigate = useNavigate();
														 
																  


  useEffect(() => {
    axios
      .get(`http://127.0.0.1:3000/viewadmin`)
      .then((res) => {
        setStudents(res.data.Result);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEditClick = (student) => {
    setIsEditing(true);
    setEditedData(student);
  };
  
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleSaveClick = () => {
    axios
      .put(`http://127.0.0.1:3000/updateAdminDetail?id=${editedData.Id}`, editedData)
      .then((res) => {
        // Check if the response has an error property
        if (res.data.Error) {
          setErrorMessage(res.data.Error); // Set error message in the state
        } else {
          // If no error, update the students and reset error message
          setStudents((prevStudents) => {
            const updatedStudents = prevStudents.map((student) => {
              if (student.Id === editedData.Id) {
                return editedData;
              }
              return student;
            });
            return updatedStudents;
          });
          setErrorMessage(null); // Reset error message
        }
        setIsEditing(false);
        setEditedData({});
      })
      .catch((err) => console.log(err));
      setErrorMessage("Failed to update details. Please try again later.");
  };

								   
						
					  
	

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleCheckboxChange = (studentId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(studentId)) {
        return prevSelectedItems.filter((id) => id !== studentId);
      } else {
        return [...prevSelectedItems, studentId];
      }
    });
  };

  const handleDeleteClick = () => {
    if (deleteConfirmed) {
    axios
      .delete(`http://127.0.0.1:3000/deleteRecord`, { data: { studentIds: selectedItems },})
      .then((res) => {
        // Check if the response has an error property
        if (res.data.Error) {
          setErrorMessage(res.data.Error); // Set error message in the state
        } else {
          // If no error, update the students and reset error message
          setStudents((prevStudents) => {
            const updatedStudents = prevStudents.filter(
              (student) => !selectedItems.includes(student.Id)
            );
            return updatedStudents;
          });
          setSelectedItems([]); // Clear selected items
          setErrorMessage(null); // Reset error message
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Failed to delete selected entries. Please try again later.");
      });
    } else {
      setErrorMessage('Deletion canceled.');
    }
  };

										  
		
		

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <div style={{ padding: '20px', width: '100%' }}>
        <div style={{ textAlign: 'center', paddingBottom: '10px' }}>
          <h4>Admin Details</h4>
          <div style={{ marginTop: '20px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
					          <TableCell>Select All / Deselect All
                      <br/>
                      <Checkbox
                      checked={selectAllChecked}
                      onChange={() => {
                        setSelectAllChecked(!selectAllChecked);
                        setSelectedItems(selectAllChecked ? [] : students.map(student => student.Id));
                      }}
                      />
                    </TableCell>			
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Admin UIN</TableCell>
                    <TableCell>DOB</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student, index) => (
                      <TableRow key={index}>
						            <TableCell>
                          <Checkbox
                          checked={selectedItems.includes(student.Id)}
                          onChange={() => handleCheckboxChange(student.Id)}
                          />
                        </TableCell>				
                        <TableCell>{student.Id}</TableCell>
                        <TableCell>
                          {isEditing && editedData.Id === student.Id ? (
                            <TextField
                              fullWidth
                              name='Name'
                              value={editedData.Name}
                              onChange={handleInputChange}
                            />
                          ) : (
                            student.Name
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing && editedData.Id === student.Id ? (
                            <TextField
                              fullWidth
                              name='UIN'
                              value={editedData.UIN}
                              onChange={handleInputChange}
                            />
                          ) : (
                            student.UIN
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing && editedData.Id === student.Id ? (
                            <TextField
                              fullWidth
                              name='DOB'
                              value={editedData.DOB}
                              onChange={handleInputChange}
                            />
                          ) : (
                            student.DOB
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing && editedData.Id === student.Id ? (
                            <TextField
                              fullWidth
                              name='Phone'
                              value={editedData.Phone}
                              onChange={handleInputChange}
                            />
                          ) : (
                            student.Phone
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing && editedData.Id === student.Id ? (
                            <TextField
                              fullWidth
                              name='Email'
                              value={editedData.Email}
                              onChange={handleInputChange}
                            />
                          ) : (
                            student.Email
                          )}
                        </TableCell>
                        <TableCell>
                          {!isEditing ? (
                            <Button
                              variant='contained'
                              color='primary'
                              onClick={() => handleEditClick(student)}
                            >
                              Edit
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant='contained'
                                color='primary'
                                onClick={handleSaveClick}
															   
                              >
                                Save
                              </Button>
                              <Button
                                variant='contained'
                                color='secondary'
                                onClick={handleCancelClick}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan='7'>Loading or empty data...</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
		      <br/>
          <Button
          variant='contained'
          style={{ backgroundColor: 'red', color: 'white' }}
          onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Selected Record
          </Button>	 
          <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the selected record(s)?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setIsDeleteDialogOpen(false); 
                setSelectedItems([]);
              }} 
                color="primary"
              >
                Cancel
              </Button>
              <Button
              onClick={() => {
              setDeleteConfirmed(true);
              setIsDeleteDialogOpen(false);
              handleDeleteClick();
              }}
              color="primary"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}
          </div>}
        </div>
      </div>
    </div>
  );
}

export default AdminViewAdmin;
