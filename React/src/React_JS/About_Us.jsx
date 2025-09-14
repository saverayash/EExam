import React from "react";
import { useNavigate } from 'react-router-dom';

const About_Us = () => {
     const navigate = useNavigate();
     const handleBack=()=>{
        navigate('/')
     }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 via-indigo-100 to-purple-100 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-5xl w-full">
        <h1 className="text-5xl font-extrabold text-indigo-800 mb-8 text-center">
          About Us
        </h1>
        <p className="text-gray-700 text-xl leading-relaxed mb-10 text-center">
          Welcome to our online exam platform! We aim to revolutionize how exams are conducted by providing a seamless, efficient, and fair platform for students, instructors, and administrators.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Students */}
          <div className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
              For Students
            </h2>
            <ul className="list-disc list-inside text-blue-700 text-base space-y-2">
              <li>Attempt exams effortlessly from anywhere.</li>
              <li>Access previous exams and track progress.</li>
              <li>Ask questions and clear doubts.</li>
              <li>View results and detailed feedback.</li>
            </ul>
          </div>

          {/* For Instructors */}
          <div className="bg-green-50 p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition">
            <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">
              For Instructors
            </h2>
            <ul className="list-disc list-inside text-green-700 text-base space-y-2">
              <li>Create customized exam papers easily.</li>
              <li>Evaluate and grade submissions.</li>
              <li>Access student performance analytics.</li>
              <li>Manage exams and provide feedback.</li>
            </ul>
          </div>

          {/* For Admins */}
          <div className="bg-red-50 p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition">
            <h2 className="text-2xl font-bold text-red-900 mb-4 text-center">
              For Admins
            </h2>
            <ul className="list-disc list-inside text-red-700 text-base space-y-2">
              <li>Oversee all exams and activities.</li>
              <li>Manage user roles and permissions.</li>
              <li>Ensure system security and reliability.</li>
              <li>Access comprehensive reports and logs.</li>
            </ul>
          </div>
        </div>

        <p className="text-gray-700 text-lg mt-10 text-center">
          Our mission is to make exams stress-free, fair, and accessible for everyone. Join us and experience the future of education!
          If you need an excess of Instructor or Admin roll please mail us on ysexam100@gmail.com , we will give you fee excess.
        </p>

        {/* About Owner Section */}
        <div className="mt-12 bg-yellow-50 p-8 rounded-2xl shadow-inner">
          <h2 className="text-3xl font-extrabold text-yellow-900 mb-6 text-center">
            About the Owner
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed text-center">
            My name is <span className="font-semibold">Yash Savera</span>. I am from Gujarat, India, and currently pursuing my B.Tech in Mathematics and Computing from{" "}
            <span className="font-semibold">Dhirubhai Ambani Institute of Information and Communication Technology</span>.
            <br />
            I built this platform using <span className="font-semibold">React.js</span> and <span className="font-semibold">Node.js</span> with the goal of ensuring that exams are conducted in a professional manner to promote better performance and progress for all users.
          </p>
        </div>
      </div>
      <button
  style={{ backgroundColor: "green", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
  onClick={() => handleBack()}
>
  Back To Home
</button>

    </div>
  );
};

export default About_Us;
