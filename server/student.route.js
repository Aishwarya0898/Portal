import express from 'express';
import db from './db.js'


const router = express.Router();

router.get('/getStudentCourseCount', (req, res) => {
    const {Id} = req.query;
    const sql = `Select count(CId) as Total from coursestudent where SId = ${Id}`;
    db.query(sql, [Id], (err, result) => {
        if(err) return res.json({Error: "Total Course Count error in sql"});
        //console.log(err);
        //console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

router.put('/updateStudentProfile', (req, res) => {
    const id = req.query.id;
    const originalDOB = req.body.DOB; 
    const dobParts = originalDOB.split('-'); 
    const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
    const sql = `UPDATE users SET Name = '${req.body.Name}', UIN = '${req.body.UIN}', DOB = '${formattedDOB}', Phone = '${req.body.Phone}', Email = '${req.body.Email}' where Id = ${id}`;
    //console.log("SQL Query:", sql);
    db.query(sql, (err, result) => {
        if(err) {
            //console.log(err);
            return res.json({Error: "Wrong DOB Formate. Please enter dd-mm-yyyy"});
        }
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getStudentCourses', (req, res) => {
    const {id} = req.query;
    const sql = `SELECT course.Id,course.CourseCode,course.courseName FROM course JOIN coursestudent ON course.Id = coursestudent.CId
    WHERE coursestudent.Id In (SELECT Id FROM coursestudent WHERE SId = ${id})`;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get Faculty course error in sql"});
        //console.log(err);
        //console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getCourseResponseStudent', (req, res) => {
    const {courseId} = req.query;
    const sql = `SELECT Discussion from courseteacher WHERE CId = ?`;
    db.query(sql, [courseId], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.json({ Error: "Get Student course discussion error in SQL" });
        }
        return res.json({ Status: "Success", Result: result });
    });
})

router.get('/getInitialStudentResponse', (req, res) => {
    const {courseId} = req.query;
    const Id = req.query.Id;
    const sql = `SELECT Response from coursestudent where CId = ${courseId} and SId = ${Id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.json({ Error: "Get Student response error in SQL" });
        }
        return res.json({ Status: "Success", Result: result });
    });
})

router.put('/updateStudentResponse', (req, res) => {
    const courseId = req.query.courseId;
    const Id = req.query.Id;
    const updatedResponse = req.body.Response;
    const sql = `UPDATE coursestudent SET Response = '${updatedResponse}' where CId = ${courseId} and SId = ${Id}`;
    //console.log("SQL Query:", sql);
    db.query(sql, (err, result) => {
        if(err) {
            //console.log(err);
            return res.json({Error: "Could not update response field"});
        }
        return res.json({Status: "Success", Result: result})
    })
})

/*API Functions Student 2.0*/

router.get('/getDiscussionThreadStudent', (req, res) => {
    const {courseId} = req.query;
   
    // Find the corresponding 'id' for the given 'coursename' from the 'course' table
    const findIdQuery = 'SELECT Id FROM courseteacher WHERE CId = ?';

    db.query(findIdQuery, [courseId], (error, results) => {
        if (error) {
            //console.log(error);
            return res.status(500).json({ Status: 'Error', message: 'Database error' });
        }

        if (results.length === 0) {
            // If no matching course is found, handle the error
            return res.status(404).json({ Status: 'Error', message: 'Id not found' });
        }   
   
        const facultyId = results[0].Id;
	
        const sql = `Select DiscussionHeading from facultydiscussionthread where CourseFacultyId = ?`;
        db.query(sql, [facultyId], (err, result) => {
            if(err) {
                //console.log('Query: ', sql);
                //console.log(err);
                return res.json({Error: "Could not fetch discussion threads for this student"});
            }
            return res.json({Status: "Success", Result: result})
        });
	});	
}) 

router.get('/getThreadDiscussionStudent', (req, res) => {
    const {thread} = req.query;
    const sql = `SELECT Discussion from facultydiscussionthread WHERE DiscussionHeading = ?`;
    db.query(sql, [thread], (err, result) => {
        if (err) {
            //console.log(err);
            console.error("Error executing SQL query:", err);
            return res.json({ Error: "Get Faculty course discussion error in SQL" });
        }
        //console.log('query: ', sql);
        //console.log(result);
        return res.json({ Status: "Success", Result: result });
    });
})

router.post('/addNewThreadResponse', (req, res) => {
    const {SId} = req.query;
    const {courseId} = req.query;
    const {threadHeading} = req.query;
    const {dialogResponse} = req.body;

    // Find the corresponding 'id' for the given 'coursename' from the 'course' table
    const findIdQuery = 'SELECT Id FROM coursestudent WHERE CId = ? and SId = ?';

    db.query(findIdQuery, [courseId, SId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ Status: 'Error', message: 'Course Student Database error' });
        }

        if (results.length === 0) {
            // If no matching course is found, handle the error
            return res.status(404).json({ Status: 'Error', message: 'CourseStudent Id not found' });
        }  

        const courseStudentId = results[0].Id; 

        const findThreadIdQuery = 'Select Id from facultydiscussionthread where DiscussionHeading = ?';

        db.query(findThreadIdQuery, [threadHeading], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ Status: 'Error', message: 'Thread Database error' });
        }

        if (results.length === 0) {
            // If no matching course is found, handle the error
            return res.status(404).json({ Status: 'Error', message: 'Thread Id not found' });
        }   
   
        const discussionThreadId = results[0].Id;
	
        const insertIntoStudentResponseQuery = 'INSERT INTO studentresponsethread (Response, CourseStudentId, DiscussionThreadId) VALUES (?, ?, ?)';

            db.query(insertIntoStudentResponseQuery, [dialogResponse, courseStudentId, discussionThreadId], (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ Status: 'Error', message: 'Could not add your response' });
                }

                // Data successfully inserted
                return res.status(200).json({ Status: 'Success', message: 'Response Added successfully!' });
            });
	    });	
    })
})

/*router.get('/getStudentThreadResponse', (req, res) => {
   const {SId} = req.query;
    const {courseId} = req.query;
    const {threadHeading} = req.query;

    // Find the corresponding 'id' for the given 'coursename' from the 'course' table
    const findIdQuery = 'SELECT Id FROM coursestudent WHERE CId = ? and SId = ?';

    db.query(findIdQuery, [courseId, SId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ Status: 'Error', message: 'Course Student Database error' });
        }

        if (results.length === 0) {
            // If no matching course is found, handle the error
            return res.status(404).json({ Status: 'Error', message: 'CourseStudent Id not found' });
        }  

        const courseStudentId = results[0].Id; 

        const findThreadIdQuery = 'Select Id from facultydiscussionthread where DiscussionHeading = ?';

        db.query(findThreadIdQuery, [threadHeading], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ Status: 'Error', message: 'Thread Database error' });
        }

        if (results.length === 0) {
            // If no matching course is found, handle the error
            return res.status(404).json({ Status: 'Error', message: 'Thread Id not found' });
        }   
   
        const discussionThreadId = results[0].Id;
	
        const selectCourseStudentThread = 'SELECT Response FROM studentresponsethread WHERE CourseStudentId = ? AND DiscussionThreadId = ? ORDER BY Id DESC;'
            db.query(selectCourseStudentThread, [courseStudentId, discussionThreadId], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ Status: 'Error', message: 'Could not fetch your responses' });
                }

                return res.json({ Status: "Success", Result: result });
                //return res.status(200).json({ Status: 'Success', message: 'Response fetched successfully!' });
                //return res.json({ Status: "Success", Result: result });
            });
	    });	
    })
})*/



router.get('/getStudentThreadResponse', (req, res) => {
    const { threadHeading } = req.query;

    // Find the corresponding 'id' for the given 'coursename' from the 'course' table
    const findThreadIdQuery = 'SELECT studentresponsethread.Id AS ID, facultydiscussionthread.Id AS ThreadId, studentresponsethread.Response, studentresponsethread.FacultyFeedback, coursestudent.Id AS StudentId, users.Name AS StudentName ' +
                              'FROM facultydiscussionthread ' +
                              'INNER JOIN studentresponsethread ON facultydiscussionthread.Id = studentresponsethread.DiscussionThreadId ' +
                              'INNER JOIN coursestudent ON studentresponsethread.CourseStudentId = coursestudent.Id ' +
                              'INNER JOIN users ON coursestudent.SId = users.Id ' +
                              'WHERE facultydiscussionthread.DiscussionHeading = ? AND studentresponsethread.is_deleted = 0 ' +
                              'ORDER BY studentresponsethread.Id DESC';

    db.query(findThreadIdQuery, [threadHeading], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ Status: 'Error', message: 'Thread Database error' });
        }

        if (results.length === 0) {
            // If no matching course is found, handle the error
            return res.status(404).json({ Status: 'Error', message: 'Error:Data could not be fetched' });
        }

        return res.json({ Status: "Success", Result: results });
    });
});

router.put('/updateEditedStudentResponse', (req, res) => {
    const {ID} = req.query;
    const { editedResponse } = req.body;
    const sql = `UPDATE studentresponsethread SET Response = ? where Id = ?`;
    //console.log("SQL Query:", sql);
    db.query(sql, [editedResponse, ID], (err, result) => {
        if(err) {
            console.log(err);
            //return res.json({Error: "Could not update discussion field"});
            return res.status(500).json({Status: 'Error', message: 'Could not update response field'});
        }
        //return res.json({Status: "Success", Result: result})
        return res.status(200).json({ Status: 'Success', message: 'Response updated successfully!' , Result:result});
    })
})

router.put('/deleteStudentResponse', (req, res) => {
    const {ID} = req.query;
    const sql = `UPDATE studentresponsethread SET is_deleted = 1 where Id = ?`;
    //console.log("SQL Query:", sql);
    db.query(sql, [ID], (err, result) => {
        if(err) {
            console.log(err);
            //return res.json({Error: "Could not update discussion field"});
            return res.status(500).json({Status: 'Error', message: 'Could not delete the details'});
        }
        //return res.json({Status: "Success", Result: result})
        return res.status(200).json({ Status: 'Success', message: 'Details deleted successfully!' , Result:result});
    })
})


export default router;