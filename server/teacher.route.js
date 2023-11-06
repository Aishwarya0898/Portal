import express from 'express';
import db from './db.js'


const router = express.Router();

router.get('/getFacultyCourseCount', (req, res) => {
    const {Id} = req.query;
    const sql = `Select count(CId) as Total from courseteacher where TId = ${Id}`;
    db.query(sql, [Id], (err, result) => {
        if(err) return res.json({Error: "Total Course Count error in sql"});
        console.log(err);
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

router.put('/updateTeacherProfile', (req, res) => {
    const id = req.query.id;
    const originalDOB = req.body.DOB; 
    const dobParts = originalDOB.split('-'); 
    const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
    const sql = `UPDATE users SET Name = '${req.body.Name}', UIN = '${req.body.UIN}', DOB = '${formattedDOB}', Phone = '${req.body.Phone}', Email = '${req.body.Email}' where Id = ${id}`;
    //console.log("SQL Query:", sql);
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            return res.json({Error: "Wrong DOB Formate. Please enter dd-mm-yyyy"});
        }
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getFacultyCourses', (req, res) => {
    const {id} = req.query;
    const sql = `SELECT course.Id,course.CourseCode,course.courseName FROM course JOIN courseteacher ON course.Id = courseteacher.CId
    WHERE courseteacher.Id In (SELECT Id FROM courseteacher WHERE ${id}= TId)`;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get Faculty course error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

/*This is for the discussion response to be displayed at the beginning*/ 
router.get('/getCourseResponse', (req, res) => {
    const {courseId} = req.query;
    const sql = `SELECT Discussion from courseteacher WHERE CId = ?`;
    db.query(sql, [courseId], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.json({ Error: "Get Faculty course discussion error in SQL" });
        }
        return res.json({ Status: "Success", Result: result });
    });
})

/* This for the discussion thread to update with new discussion, if any*/
router.put('/updateTeacherCourseResponse', (req, res) => {
    const courseId = req.query.courseId;
    const Id = req.query.Id;
    const sql = `UPDATE courseteacher SET Discussion = '${req.body.Discussion}' where CId = ${courseId} and TId = ${Id}`;
    //console.log("SQL Query:", sql);
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            return res.json({Error: "Could not update discussion field"});
        }
        return res.json({Status: "Success", Result: result})
    })
})

/*this is to get the student details under that particular course*/
router.get('/getFacultyStudentCourse', (req, res) => {
    const {courseId} = req.query;
    const sql = `SELECT users.Id,users.Name,users.UIN
    FROM users 
    JOIN coursestudent ON users.id = coursestudent.sid 
    WHERE coursestudent.cid = ${courseId}`;
    db.query(sql, [courseId], (err, result) => {
        if(err) return res.json({Error: "Get student for course error in sql"});
        //console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

/*this is to view the students response for that particular course discussion*/
router.get('/getFacultyStudentResponse', (req, res) => {
    const {courseId} = req.query;
    const {studentId} = req.query;
    const sql = `Select coursestudent.Response from coursestudent where SId = ${studentId} and CId = ${courseId}`;
    db.query(sql, [studentId, courseId], (err, result) => {
        if(err) return res.json({Error: "Get student response error in sql"});
        //console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

/*API FOR FACULTY FUNCTIONS 2.0*/

router.get('/getDiscussionThreads', (req, res) => {
    const {Id} = req.query;
    const {courseId} = req.query;
   
    // Find the corresponding 'id' for the given 'coursename' from the 'course' table
    const findIdQuery = 'SELECT Id FROM courseteacher WHERE CId = ? and TId = ?';

    db.query(findIdQuery, [courseId, Id], (error, results) => {
        if (error) {
            console.log(error);
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
                console.log('Query: ', sql);
                console.log(err);
                return res.json({Error: "Could not fetch discussion threads for this faculty"});
            }
            return res.json({Status: "Success", Result: result})
        });
	});	
}) 

router.post('/addDiscussionThreads', (req, res) =>{
    const {Id} = req.query;
    const {courseId} = req.query;
    const {DiscussionHeading} = req.body;
   
    // Find the corresponding 'id' for the given 'coursename' from the 'course' table
    const findIdQuery = 'SELECT Id FROM courseteacher WHERE CId = ? and TId = ?';

    db.query(findIdQuery, [courseId, Id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ Status: 'Error', message: 'Database error' });
        }

        if (results.length === 0) {
            // If no matching course is found, handle the error
            return res.status(404).json({ Status: 'Error', message: 'Id not found' });
        }   
   
        const facultyId = results[0].Id;
	
        const sql = `Insert into facultydiscussionthread (DiscussionHeading, CourseFacultyId) values (?,?)`;
        db.query(sql, [DiscussionHeading,facultyId], (err, result) => {
            if(err) {
                console.log('Query: ', sql);
                console.log(err);
                return res.json({Error: "Could not add discussion threads"});
            }
            return res.json({Status: "Success", Result: result})
        });
	});	
})

router.get('/getThreadResponse', (req, res) => {
    const {thread} = req.query;
    const sql = `SELECT Discussion from facultydiscussionthread WHERE DiscussionHeading = ?`;
    db.query(sql, [thread], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.json({ Error: "Get Faculty course discussion error in SQL" });
        }
        return res.json({ Status: "Success", Result: result });
    });
})

router.put('/updateThreadResponse', (req, res) => {
    const {response} = req.query;
    const sql = `UPDATE facultydiscussionthread SET Discussion = '${req.body.Discussion}' where DiscussionHeading = ?`;
    //console.log("SQL Query:", sql);
    db.query(sql, [response], (err, result) => {
        if(err) {
            console.log(err);
            //return res.json({Error: "Could not update discussion field"});
            return res.status(500).json({Status: 'Error', message: 'Could not update discussion field'});
        }
        //return res.json({Status: "Success", Result: result})
        return res.status(200).json({ Status: 'Success', message: 'Discussion Thread updated successfully!' , Result:result});
    })
})

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

router.put('/updateFacultyFeedback', (req, res) => {
    const {ID} = req.query;
    const { feedback } = req.body;
    const sql = `UPDATE studentresponsethread SET FacultyFeedback = ? where Id = ?`;
    //console.log("SQL Query:", sql);
    db.query(sql, [feedback, ID], (err, result) => {
        if(err) {
            console.log(err);
            //return res.json({Error: "Could not update discussion field"});
            return res.status(500).json({Status: 'Error', message: 'Could not update feedback field'});
        }
        //return res.json({Status: "Success", Result: result})
        return res.status(200).json({ Status: 'Success', message: 'Faculty Feedback updated successfully!' , Result:result});
    })
})

router.put('/deleteFacultyStudentResponse', (req, res) => {
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