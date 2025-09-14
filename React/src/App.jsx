import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './React_JS/Index';
import User from './React_JS/User'; 
import Admin from './React_JS/Admin';
import Instructor from './React_JS/Instructor';
import Change_Password from './React_JS/Change_Password';
import Privious_Exams from './React_JS/Privious_Exams';
import Ask_Doubt from './React_JS/Ask_Doubt';
import Exams from './React_JS/Exams';
import Add_Another from  './React_JS/Add_Another';
import Add_Exam_Paper from './React_JS/Add_Exam_Paper';
import Check_Exam_Paper from './React_JS/Check_Exam_Paper';
import Give_Exam from './React_JS/Give_Exam';
import Sidebar_User from './React_JS/Sidebar_User.jsx';
import MyExam from './React_JS/MyExam.jsx';
import Given_Exam from './React_JS/Given_Exam.jsx';
import Sidebar_Instructor  from './React_JS/Sidebar_Instructor.jsx';
import Doubt_Student from './React_JS/Doubt_Student.jsx';
import Doubt_Instructor from './React_JS/Doubt_Instructor.jsx';
import See_Exam from './React_JS/See_Exam.jsx';
import Privious_Exams_Instructor from './React_JS/Privious_Exams_Instructor.jsx';
import See_Response from './React_JS/See_Response.jsx';
import View_Student_Response from './React_JS/View_Student_Response.jsx';
import Check_Student_Response from './React_JS/Check_Student_Response.jsx';
import Check_Student_Response_Manually from './React_JS/Check_Student_Response_Manually.jsx';
import About_Us from './React_JS/About_Us.jsx';
import Profile from './React_JS/Profile.jsx';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/user" element={<User />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/instructor" element={<Instructor />} />
                <Route path='/change_password' element={<Change_Password />}/>
                <Route path='/exams' element={<Exams />}/>
                <Route path='/privious_exams' element={<Privious_Exams />}/>
                <Route path='/ask_doubt' element={<Ask_Doubt />}/>
                <Route path='/add_another' element={<Add_Another/>}/>
                <Route path='/add_exam_paper' element={<Add_Exam_Paper/>}/>
                <Route path='/check_exam_paper' element={<Check_Exam_Paper/>}/>
                <Route path='/give_exam/:id' element={<Give_Exam/>}/>
                <Route path='/sidebar' element={<Sidebar_User/>}/>
                <Route path='/myexam' element={<MyExam/>}/>
                <Route path='/given_exam/:id' element={<Given_Exam/>}/>
                <Route path='/sidebar_instructor' element={<Sidebar_Instructor/>}/>
                <Route path='doubt_student' element={<Doubt_Student/>}/>
                <Route path='doubt_instructor' element={<Doubt_Instructor/>}/>
                <Route path='/see_exam/:id' element={<See_Exam/>}/>
                <Route path='/privious_exams_instructor' element={<Privious_Exams_Instructor />}/>
                <Route path='/see_response/:id' element={<See_Response/>}/>
                <Route path='/view_student_response/:student_id/:exam_id' element={<View_Student_Response/>}/>
                <Route path='/check_student_response/:id' element={<Check_Student_Response/>}/>
                <Route path='/check_student_response_manually/:student_id/:exam_id' element={<Check_Student_Response_Manually/>}/>
                <Route path='/about_us' element={<About_Us/>}/>
                <Route path='/profile' element={<Profile/>}/>
            </Routes>
        </Router>
    );
}

export default App;
