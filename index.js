require('dotenv').config();
const express = require('express');

const userRoutes = require('./routes/userRoutes')
const courseRoutes = require('./routes/courseRoutes')
const instructorRoutes = require('./routes/instructorRoutes')
const departmentRoutes = require('./routes/departmentRoutes')
const courseDetailRoutes = require('./routes/courseDetailRoutes')
const courseMediaRoutes = require('./routes/courseMediaRoutes')
const studentRoutes = require('./routes/studentRoutes')
const studentCourseRoutes = require('./routes/studentCourseRoutes')
const courseExamRoutes = require('./routes/courseExamRoutes')
const examQuestionRoutes = require('./routes/examQuestionRoutes')
const examAnswerRoutes = require('./routes/examAnswerRoutes')

require('./db');
const app = express();
const port = 3000;


// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//
//routes
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/instructors', instructorRoutes);
app.use('/departments', departmentRoutes);
app.use('/course-details', courseDetailRoutes);
app.use('/course-media', courseMediaRoutes);
app.use('/students', studentRoutes);
app.use('/student-courses', studentCourseRoutes);
app.use('/course-exams', courseExamRoutes);
app.use('/exam-questions', examQuestionRoutes);
app.use('/exam-answers', examAnswerRoutes);
//
//global handler
app.use((err,req,res,next)=>{
    console.log('error', err);
    const statusCode = err.statusCode ||500;
    res.status(statusCode).json({msessage: 'something went wrong'});
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))