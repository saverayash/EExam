import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './components/Index';
import User from './components/User'; 
import Admin from './components/Admin';
import Instructor from './components/Instructor';
import Change_Password from './components/Change_Password';
import Privious_Exams from './components/Privious_Exams';
import Ask_Doubt from './components/Ask_Doubt';
import Exams from './components/Exams';
import Add_Another from  './components/Add_Another';
import Add_Exam_Paper from './components/Add_Exam_Paper';
import Check_Exam_Paper from './components/Check_Exam_Paper';
import Give_Exam from './components/Give_Exam';
import Sidebar_User from './components/Sidebar_User.jsx';
import MyExam from './components/MyExam.jsx';
import Given_Exam from './components/Given_Exam.jsx';
import Sidebar_Instructor  from './components/Sidebar_Instructor.jsx';
import Doubt_Student from './components/Doubt_Student.jsx';
import Doubt_Instructor from './components/Doubt_Instructor.jsx';
import See_Exam from './components/See_Exam.jsx';
import Privious_Exams_Instructor from './components/Privious_Exams_Instructor.jsx';
import See_Response from './components/See_Response.jsx';
import View_Student_Response from './components/View_Student_Response.jsx';
import Check_Student_Response from './components/Check_Student_Response.jsx';
import Check_Student_Response_Manually from './components/Check_Student_Response_Manually.jsx';
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
            </Routes>
        </Router>
    );
}

export default App;
