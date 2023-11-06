import express from 'express';
import db from './db.js'


const router = express.Router();

router.get('/getAdminTotalCount', (req, res) => {
    //const {userId} = req.query;
    const sql = `SELECT COUNT(*) as Total FROM users WHERE RoleId IN (1, 2)`;
    db.query(sql, (err, result) => {
        if(err) return res.json({Error: "Total Count error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getStudent', (req, res) => {
    const {userId} = req.query;
    //console.log(userId);
    const sql = `Select *, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB From users where Id = ${userId} `;
    db.query(sql, [userId], (err, result) => {
        if(err) return res.json({Error: "Get student error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getAdmin', (req, res) => {
    const {userId} = req.query;
    //console.log(userId);
    const sql = `Select *, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB From users where Id = ${userId} `;
    db.query(sql, [userId], (err, result) => {
        if(err) return res.json({Error: "Get student error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getTeacher', (req, res) => {
    const {userId} = req.query;
    //console.log(userId);
    const sql = `Select *, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB From users where Id = ${userId} `;
    db.query(sql, [userId], (err, result) => {
        if(err) return res.json({Error: "Get Teacher Details error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getCourses', (req, res) => {
    //const {userId} = req.query;
    const sql = `Select Id, CourseCode, CourseName from course;`;
    db.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get Course error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

router.put('/updateStudentDetail', (req, res) => {
    const editedDataId = req.query.id;
    const originalDOB = req.body.DOB; 
    const dobParts = originalDOB.split('-'); 
    const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
    const sql = `UPDATE users SET Name = '${req.body.Name}', UIN = '${req.body.UIN}', DOB = '${formattedDOB}', Phone = '${req.body.Phone}', Email = '${req.body.Email}' where Id = ${editedDataId}`;
    //console.log("SQL Query:", sql);
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            return res.json({Error: "Wrong DOB Formate. Please enter dd-mm-yyyy"});
        }
        return res.json({Status: "Success", Result: result})
    })
})

router.put('/updateAdminDetail', (req, res) => {
    const editedDataId = req.query.id;
    const originalDOB = req.body.DOB; 
    const dobParts = originalDOB.split('-'); 
    const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
    const sql = `UPDATE users SET Name = '${req.body.Name}', UIN = '${req.body.UIN}', DOB = '${formattedDOB}', Phone = '${req.body.Phone}', Email = '${req.body.Email}' where Id = ${editedDataId}`;
    //console.log("SQL Query:", sql);
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            return res.json({Error: "Wrong DOB Formate. Please enter dd-mm-yyyy"});
        }
        return res.json({Status: "Success", Result: result})
    })
})

router.put('/updateAdminProfile', (req, res) => {
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

router.put('/updateFacultyDetail', (req, res) => {
    const editedDataId = req.query.id;
    const originalDOB = req.body.DOB; 
    const dobParts = originalDOB.split('-'); 
    const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
    const sql = `UPDATE users SET Name = '${req.body.Name}', UIN = '${req.body.UIN}', DOB = '${formattedDOB}', Phone = '${req.body.Phone}', Email = '${req.body.Email}' where Id = ${editedDataId}`;
    //console.log("SQL Query:", sql);
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            return res.json({Error: "Wrong DOB Formate. Please enter dd-mm-yyyy"});
        }
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/viewstudent', (req, res) => {
    const sql = `Select Id, Name, UIN, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB, Phone, Email from users where RoleId=1`;
    db.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get user details error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/viewfaculty', (req, res) => {
    const sql = `Select Id, Name, UIN, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB, Phone, Email from users where RoleId=2`;
    db.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get user details error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/viewadmin', (req, res) => {
    const sql = `Select Id, Name, UIN, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB, Phone, Email from users where RoleId=3`;
    db.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get user details error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getAdminStudentCourses', (req, res) => {
    const {courseId} = req.query;
    const sql = `SELECT course.CourseCode,course.courseName FROM course JOIN coursestudent ON course.Id = coursestudent.CId
    WHERE coursestudent.Id In (SELECT Id FROM coursestudent WHERE ${courseId}= SId)`;
    db.query(sql, [courseId], (err, result) => {
        if(err) return res.json({Error: "Get student course error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getAdminStudentCourse', (req, res) => {
    const {courseId} = req.query;
    const sql = `SELECT users.Id,users.Name,users.UIN,users.Email 
    FROM users 
    JOIN coursestudent ON users.id = coursestudent.sid 
    WHERE coursestudent.cid = ${courseId}`;
    db.query(sql, [courseId], (err, result) => {
        if(err) return res.json({Error: "Get student course error in sql"});
        //console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getAdminFacultyCourse', (req, res) => {
    const {courseId} = req.query;
    const sql = `SELECT users.Id,users.Name,users.UIN,users.Email 
    FROM users 
    JOIN courseteacher ON users.id = courseteacher.tid 
    WHERE courseteacher.cid = ${courseId}`;
    db.query(sql, [courseId], (err, result) => {
        if(err) return res.json({Error: "Get student course error in sql"});
        //console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

router.get('/getAdminFacultyCourses', (req, res) => {
    const {courseId} = req.query;
    const sql = `SELECT course.CourseCode,course.courseName FROM course JOIN courseteacher ON course.Id = courseteacher.CId
    WHERE courseteacher.Id In (SELECT Id FROM courseteacher WHERE ${courseId}= TId)`;
    db.query(sql, [courseId], (err, result) => {
        if(err) return res.json({Error: "Get student course error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})


router.post('/adminInsertUser', (req, res) => {
    const values = [
        req.body.name,
        req.body.uin,
        req.body.dob,
        req.body.phone,
        req.body.email,
        req.body.roleId
    ];
    const sql = "INSERT INTO users (Name,UIN,DOB,Phone,Email,RoleId) VALUES (?,?,?,?,?,?)";
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error in inserting details into server", err);
            return res.status(500).json({ Error: "Error in inserting details into server", err });
        }
        console.log(err);
        return res.json({ Status: "Success" });
    })
})

router.post('/addCourse', (req, res) => {
    const { courseCode, courseName } = req.body;

    const sql = 'INSERT INTO course (CourseCode, CourseName) VALUES (?, ?)';

    db.query(sql, [courseCode, courseName], (error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ Status: 'Error', message: 'Database error' });
        }

        // Data successfully inserted
        return res.status(200).json({ Status: 'Success', message: 'New Course Added successfully!' });
    });
});


router.post('/addCourseStudent', (req, res) => {
    const { courseId, coursename } = req.body;

    // Find the corresponding 'id' for the given 'coursename' from the 'course' table
    const findCourseIdQuery = 'SELECT Id FROM course WHERE CourseName = ?';

    db.query(findCourseIdQuery, [coursename], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ Status: 'Error', message: 'Database error' });
        }

        if (results.length === 0) {
            // If no matching course is found, handle the error
            return res.status(404).json({ Status: 'Error', message: 'Course not found' });
        }

        const courseIdFromDatabase = results[0].Id;

        // Check if the student is already registered for the course
        const checkRegistrationQuery = 'SELECT * FROM coursestudent WHERE CId = ? AND SId = ?';

        db.query(checkRegistrationQuery, [courseIdFromDatabase, courseId], (error, registrationResults) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ Status: 'Error', message: 'Database error' });
            }

            if (registrationResults.length > 0) {
                // If the student is already registered, send an appropriate message
                return res.status(200).json({ Status: 'Error', message: 'Already registered for the course. Please try registering to a different course.' });
            }

            // Insert data into 'coursestudent' table using the found 'id' and 'courseId'
            const insertIntoCourseStudentQuery = 'INSERT INTO coursestudent (CId, SId) VALUES (?, ?)';

            db.query(insertIntoCourseStudentQuery, [courseIdFromDatabase, courseId], (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ Status: 'Error', message: 'Database error' });
                }

                // Data successfully inserted
                return res.status(200).json({ Status: 'Success', message: 'Course registered successfully!' });
            });
        });
    });
});


router.post('/addCourseFaculty', (req, res) => {
    const { courseId, coursename } = req.body;

    // Find the corresponding 'id' for the given 'coursename' from the 'course' table
    const findCourseIdQuery = 'SELECT Id FROM course WHERE CourseName = ?';

    db.query(findCourseIdQuery, [coursename], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ Status: 'Error', message: 'Database error' });
        }

        if (results.length === 0) {
            // If no matching course is found, handle the error
            return res.status(404).json({ Status: 'Error', message: 'Course not found' });
        }

        const courseIdFromDatabase = results[0].Id;

        // Check if the course is already assigned to a faculty
        const checkAssignmentQuery = 'SELECT * FROM courseteacher WHERE CId = ?';

        db.query(checkAssignmentQuery, [courseIdFromDatabase], (error, assignmentResults) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ Status: 'Error', message: 'Database error' });
            }

            if (assignmentResults.length > 0) {
                // If the course is already assigned, send an appropriate message
                return res.status(200).json({ Status: 'Error', message: 'This course is already assigned to a faculty. Please try registering for a different course.' });
            }

            // Insert data into 'courseteacher' table using the found 'id' and 'courseId'
            const insertIntoCourseTeacherQuery = 'INSERT INTO courseteacher (CId, TId) VALUES (?, ?)';

            db.query(insertIntoCourseTeacherQuery, [courseIdFromDatabase, courseId], (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ Status: 'Error', message: 'Database error' });
                }

                // Data successfully inserted
                return res.status(200).json({ Status: 'Success', message: 'Course registered successfully!' });
            });
        });
    });
});


router.delete('/deleteRecord', (req, res) => {
    const { studentIds } = req.body;
    const sql = `delete from users where Id = ${studentIds}`;
    db.query(sql, [studentIds], (err, result) => {
        if(err) return res.json({Error: "Error in deleting the record"});
        console.log(err);
        return res.json({Status: "Record Deleted Successfully", Result: result})
    })
})

router.delete('/dropCoursesFaculty', (req, res) => {
    const { studentId, courseCodes } = req.body;
    
    // Constructing the subquery to fetch matching CIds from the course table
    const subquery = `SELECT Id FROM course WHERE CourseCode IN (${courseCodes.map(code => `'${code}'`).join(', ')})`;
    
    // Constructing the main delete query using the subquery
    const sql = `DELETE FROM courseteacher WHERE CId IN (${subquery}) AND TId = ${studentId}`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ Error: "Error in deleting the selected courses" });
        }
        console.log(result);
        return res.json({ Status: "Course(s) Deleted Successfully", Result: result });
    });
});

router.delete('/dropCoursesStudent', (req, res) => {
    const { studentId, courseCodes } = req.body;
    
    // Constructing the subquery to fetch matching CIds from the course table
    const subquery = `SELECT Id FROM course WHERE CourseCode IN (${courseCodes.map(code => `'${code}'`).join(', ')})`;
    
    // Constructing the main delete query using the subquery
    const sql = `DELETE FROM coursestudent WHERE CId IN (${subquery}) AND SId = ${studentId}`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ Error: "Error in deleting the selected courses" });
        }
        console.log(result);
        return res.json({ Status: "Course(s) Deleted Successfully", Result: result });
    });
});


export default router;