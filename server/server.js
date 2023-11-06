import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';
import teacherRouter from './teacher.route.js'
import adminRouter from './admin.route.js'
import studentRouter from './student.route.js'
import db from './db.js'


const salt = 10;
const app = express();
app.use(express.json());
app.use(cors(
    {
        origin: ["http://127.0.0.1:5173"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))



/*INITIAL API CALLS*/

app.post('/register', (req, res) => {
    const sql = "INSERT INTO users (Name,UIN,DOB,Phone,RoleId,Email,Password) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) =>{
        if(err) return res.json({Error: "Error for hashing password"});
        const values = [
            req.body.name,
            req.body.uin,
            req.body.dob,
            req.body.phone,
            req.body.roleId,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, result) =>{
            if(err) return res.json({Error: "Error in inserting data into server", err});
            //console.log(err);
            return res.json({Status: "Success"});
        })
    })
})

app.post('/Login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE Email = ?';
    db.query(sql, [req.body.email], (err, data) => {
        var string=JSON.stringify(data);
        var json =  JSON.parse(string);
        console.log(json[0])
        if(err) return res.json({Error: "Server Login Error"});
        if(data.length > 0){
            const id=data[0].id;
            const token = jwt.sign({id, Id: data[0].Id}, "jwt-secret-key", {expiresIn: '1d'});
            res.cookie('token', token);
            req.session.username=data[0].Email;
            bcrypt.compare(req.body.password.toString(), json[0].Password, (err, response) => {
                if(err) return res.json({Error: "Password compare error"});
                if(response){
                    const userRole = data[0].RoleId;
                    return res.json({Status: "Success", RoleId: userRole, Phone: data[0].Phone, Email: data[0].Email, Name: data[0].Name, Id: data[0].Id})
                } else {
                    return res.json({Error: "Password did not match"});
                }
            })
        } else {
            return res.json({Error: "Email doesnt Exist"});
        }
    })

})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Error: "You are no Authenticated"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            req.Id = decoded.Id;
            req.Name = decoded.Name;
            //console.log(req.Id);
            if(err) {
                return res.json({Error: "Token wrong"});
            } else {
            if(req.session.username) {
                next();
            } else {
                return res.json({Error: "Session data is missing"});
            }
        }
        })
    }
}

app.get('/studentdashboard', verifyUser, (req, res) =>{
    return res.json({Status: "Success", username: req.session.username})
})


app.get('/studentdashboard/home', verifyUser, (req, res) =>{
    return res.json({Status: "Success", username: req.session.username, Name: req.Name})
})

app.get('/teacherdashboard/home', verifyUser, (req, res) =>{
    return res.json({Status: "Success", username: req.session.username, Name: req.Name})
})

app.get('/studentdashboard/profilestudent', verifyUser, (req, res) =>{
    return res.json({Status: "Success", username: req.session.username, Id: req.Id})
})

app.get('/teacherdashboard', verifyUser, (req, res) =>{
    return res.json({Status: "Success", username: req.session.username})
})

app.get('/admindashboard', verifyUser, (req, res) =>{
    return res.json({Status: "Success", username: req.session.username})
})


app.use(adminRouter)
/*API FOR ADMIN FUNCTIONS

app.get('/getAdminTotalCount', (req, res) => {
    //const {userId} = req.query;
    const sql = `SELECT COUNT(*) as Total FROM users WHERE RoleId IN (1, 2)`;
    db.query(sql, (err, result) => {
        if(err) return res.json({Error: "Total Count error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/getStudent', (req, res) => {
    const {userId} = req.query;
    //console.log(userId);
    const sql = `Select *, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB From users where Id = ${userId} `;
    db.query(sql, [userId], (err, result) => {
        if(err) return res.json({Error: "Get student error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/getAdmin', (req, res) => {
    const {userId} = req.query;
    //console.log(userId);
    const sql = `Select *, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB From users where Id = ${userId} `;
    db.query(sql, [userId], (err, result) => {
        if(err) return res.json({Error: "Get student error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/getTeacher', (req, res) => {
    const {userId} = req.query;
    //console.log(userId);
    const sql = `Select *, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB From users where Id = ${userId} `;
    db.query(sql, [userId], (err, result) => {
        if(err) return res.json({Error: "Get Teacher Details error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/getCourses', (req, res) => {
    //const {userId} = req.query;
    const sql = `Select Id, CourseCode, CourseName from course;`;
    db.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get Course error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.put('/updateStudentDetail', (req, res) => {
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

app.put('/updateAdminDetail', (req, res) => {
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

app.put('/updateAdminProfile', (req, res) => {
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

app.put('/updateFacultyDetail', (req, res) => {
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

app.get('/viewstudent', (req, res) => {
    const sql = `Select Id, Name, UIN, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB, Phone, Email from users where RoleId=1`;
    db.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get user details error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/viewfaculty', (req, res) => {
    const sql = `Select Id, Name, UIN, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB, Phone, Email from users where RoleId=2`;
    db.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get user details error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/viewadmin', (req, res) => {
    const sql = `Select Id, Name, UIN, DATE_FORMAT(DOB, '%d-%m-%Y') AS DOB, Phone, Email from users where RoleId=3`;
    db.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get user details error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/getAdminStudentCourses', (req, res) => {
    const {courseId} = req.query;
    const sql = `SELECT course.CourseCode,course.courseName FROM course JOIN coursestudent ON course.Id = coursestudent.CId
    WHERE coursestudent.Id In (SELECT Id FROM coursestudent WHERE ${courseId}= SId)`;
    db.query(sql, [courseId], (err, result) => {
        if(err) return res.json({Error: "Get student course error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/getAdminStudentCourse', (req, res) => {
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

app.get('/getAdminFacultyCourse', (req, res) => {
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

app.get('/getAdminFacultyCourses', (req, res) => {
    const {courseId} = req.query;
    const sql = `SELECT course.CourseCode,course.courseName FROM course JOIN courseteacher ON course.Id = courseteacher.CId
    WHERE courseteacher.Id In (SELECT Id FROM courseteacher WHERE ${courseId}= TId)`;
    db.query(sql, [courseId], (err, result) => {
        if(err) return res.json({Error: "Get student course error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})


app.post('/adminInsertUser', (req, res) => {
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


app.post('/addCourseStudent', (req, res) => {
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


app.post('/addCourseFaculty', (req, res) => {
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


app.delete('/deleteRecord', (req, res) => {
    const { studentIds } = req.body;
    const sql = `delete from users where Id = ${studentIds}`;
    db.query(sql, [studentIds], (err, result) => {
        if(err) return res.json({Error: "Error in deleting the record"});
        console.log(err);
        return res.json({Status: "Record Deleted Successfully", Result: result})
    })
})

app.delete('/dropCoursesFaculty', (req, res) => {
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

app.delete('/dropCoursesStudent', (req, res) => {
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
}); */


app.use(teacherRouter)
/*API FOR FACULTY FUNCTIONS

app.get('/getFacultyCourseCount', (req, res) => {
    const {Id} = req.query;
    const sql = `Select count(CId) as Total from courseteacher where TId = ${Id}`;
    db.query(sql, [Id], (err, result) => {
        if(err) return res.json({Error: "Total Course Count error in sql"});
        console.log(err);
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

app.put('/updateTeacherProfile', (req, res) => {
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

app.get('/getFacultyCourses', (req, res) => {
    const {id} = req.query;
    const sql = `SELECT course.Id,course.CourseCode,course.courseName FROM course JOIN courseteacher ON course.Id = courseteacher.CId
    WHERE courseteacher.Id In (SELECT Id FROM courseteacher WHERE ${id}= TId)`;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get Faculty course error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

This is for the discussion response to be displayed at the beginning
app.get('/getCourseResponse', (req, res) => {
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

This for the discussion thread to update with new discussion, if any
app.put('/updateTeacherCourseResponse', (req, res) => {
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

/*this is to get the student details under that particular course
app.get('/getFacultyStudentCourse', (req, res) => {
    const {courseId} = req.query;
    const sql = `SELECT users.Id,users.Name,users.UIN,users.Email 
    FROM users 
    JOIN coursestudent ON users.id = coursestudent.sid 
    WHERE coursestudent.cid = ${courseId}`;
    db.query(sql, [courseId], (err, result) => {
        if(err) return res.json({Error: "Get student for course error in sql"});
        //console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

this is to view the students response for that particular course discussion
app.get('/getFacultyStudentResponse', (req, res) => {
    const {courseId} = req.query;
    const {studentId} = req.query;
    const sql = `Select coursestudent.Response from coursestudent where SId = ${studentId} and CId = ${courseId}`;
    db.query(sql, [studentId, courseId], (err, result) => {
        if(err) return res.json({Error: "Get student response error in sql"});
        //console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

API FOR FACULTY FUNCTIONS 2.0

app.get('/getDiscussionThreads', (req, res) => {
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
            return res.status(404).json({ Status: 'Error', message: 'Course not found' });
        }
    });

    db.query(sql, [Id, courseId], (err, result) => {
        if(err) return res.json({Error: "Get Faculty course error in sql"});
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

app.post('/addDiscussionThreads', (req, res) =>{
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
                return res.json({Error: "Could not add discussion discussion"});
            }
            return res.json({Status: "Success", Result: result})
        });
	});	
}) */


app.use(studentRouter)
/*API FOR STUDENT FUNCTIONS

app.get('/getStudentCourseCount', (req, res) => {
    const {Id} = req.query;
    const sql = `Select count(CId) as Total from coursestudent where SId = ${Id}`;
    db.query(sql, [Id], (err, result) => {
        if(err) return res.json({Error: "Total Course Count error in sql"});
        console.log(err);
        console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

app.put('/updateStudentProfile', (req, res) => {
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

app.get('/getStudentCourses', (req, res) => {
    const {id} = req.query;
    const sql = `SELECT course.Id,course.CourseCode,course.courseName FROM course JOIN coursestudent ON course.Id = coursestudent.CId
    WHERE coursestudent.Id In (SELECT Id FROM coursestudent WHERE SId = ${id})`;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get Faculty course error in sql"});
        console.log(err);
        //console.log(result);
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/getCourseResponseStudent', (req, res) => {
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

app.get('/getInitialStudentResponse', (req, res) => {
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

app.put('/updateStudentResponse', (req, res) => {
    const courseId = req.query.courseId;
    const Id = req.query.Id;
    const updatedResponse = req.body.Response;
    const sql = `UPDATE coursestudent SET Response = '${updatedResponse}' where CId = ${courseId} and SId = ${Id}`;
    //console.log("SQL Query:", sql);
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            return res.json({Error: "Could not update response field"});
        }
        return res.json({Status: "Success", Result: result})
    })
})*/


/*Last API*/
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    req.session.destroy();
    return res.json({Status: "Success"});
})

  app.listen(3000, () => {
    console.log('Server started at 3000')
})