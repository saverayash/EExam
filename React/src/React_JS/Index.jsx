import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Home from './Home.webp';
import { jwtDecode } from 'jwt-decode';

function Index() {
    const [Id, setId] = useState('');
    const [Password, setPassword] = useState('');
    const [Mail_Id, setMailId] = useState('');
    const [Education, setEducation] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [isVerification, setIsVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [ForgotPassword,setForgotPassword]=useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successfulMessage,setSuccessfullMessage]=useState('');
    const [emailSent, setEmailSent] = useState(false);  
     const [ForgotPasswordWindow,setForgotPasswordWindow]=useState(false);
     const [newPassword,setnewPassword]=useState('');
     const [confirmnewPassword,setconfirmnewPassword]=useState('');
    useEffect(() => {
        if (isVerification && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            },300);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setCanResend(true);
        }
    }, [isVerification, timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', {
                id: Id,
                password: Password
            });
             console.log(response);
            if (response.status === 200) {
                const { role, token, Id } = response.data;
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('role', role);
                localStorage.setItem('Id', Id);
                const decodedToken = jwtDecode(token);
                const Mail_Id = decodedToken.Mail_Id;  // Correct extraction
                
                localStorage.setItem("Mail_Id", Mail_Id);
                if(role === "user")
                    navigate('/user');
                else if(role === 'Admin')
                    navigate('/admin');
                else if(role === 'Instructor')
                    navigate('/instructor');
               
            } else {
                setErrorMessage("User with this Id and Password does not exist , Please enter Id and Password Correctly");
            setTimeout(() => setErrorMessage(''),5000); 
            }
        } catch (error) {
            setErrorMessage("User with this Id and Password does not exist , Please enter Id and Password Correctly");
            setTimeout(() => setErrorMessage(''),5000); 
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/signup', {
                id: Id,
                password: Password,
                mail_id: Mail_Id,
                education: Education,
            });
    
            if (response.status === 200) {  
                setSuccessfullMessage('Please check your email for verification and Your Sign Up will be Successfull');
                setTimeout(() => setSuccessfullMessage(''),3000); 
                setIsVerification(true); 
                setTimer(30);
                setCanResend(false);
            } else {
                setErrorMessage('User with this either Id or Mail Id exists');
                setTimeout(() => setErrorMessage(''),300); 
            }
        } catch (error) {
            setErrorMessage('User with this either Id or Mail Id exists');
            setTimeout(() => setErrorMessage(''),3000); 
        }
    };
    

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/verify-code', {
                id: Id,
                password: Password,
                mail_id: Mail_Id,
                education: Education,
                code: verificationCode
            });
            if (response.status === 200) {
                setSuccessfullMessage('Verification successful!');
              
                setIsSignup(false);
                setForgotPassword(false);
                setForgotPasswordWindow(false);
                setEmailSent(false);
                setIsVerification(false);
                setTimeout(() => setSuccessfullMessage(''),3000);
            } else {
                setErrorMessage("Incorrect Verification code , Please enter code correctly");
                setTimeout(() => setErrorMessage(''),300); 
            }
        } catch (error) {
            setErrorMessage("Incorrect Verification code , Please enter code correctly");
            setTimeout(() => setErrorMessage(''),300); 
        }
    };
    
    const handleForgotPassword=()=>{
        setIsSignup(false);
        setIsVerification(false);
        setForgotPassword(true);
    }
    const handleResendCode = async () => {
        if (!canResend) return;
        await axios.post('http://localhost:3000/send-verification', { mail_id: Mail_Id });
        setTimer(30);
        setCanResend(false);
    };
    const handleForgotId = async () => {
        
        setSuccessfullMessage("Verification Code Sent Successfully ");
        setTimeout(() => setSuccessfullMessage(''), 2000); 
        await axios.post('http://localhost:3000/send-verification', { mail_id: Mail_Id });
        // if (!canResend) return;
        // setTimer(30);
        // setCanResend(false);
        setForgotPassword(true);
        setEmailSent(true); 
        // console.log(emailSent+" "+ForgotPassword+" "+ForgotPasswordWindow);
    };
    const handleVerificationCodeSubmit= async ()=>{
        try
        {
            // console.log(Mail_Id+" "+verificationCode);
       const response=await  axios.post('http://localhost:3000/forgotpassword',{mail_id:Mail_Id,verificationCode:verificationCode});
        console.log(response);
            if(response.status===200)
            {
                setForgotPasswordWindow(true);
                    setEmailSent(false);
                setSuccessfullMessage('Verification successful!');
                setTimeout(() => setSuccessfullMessage(''),2000); 
            }
            else
            {
                setErrorMessage("Incorrect Verification code , Please enter code correctly");
                setTimeout(() => setErrorMessage(''),2000); 
            }
        }
        catch(e)
        {
            console.log(e);
            setErrorMessage("Incorrect Verification code , Please enter code correctly");
            setTimeout(() => setErrorMessage(''),2000); 
        }
    };
    const handlePasswordChange=async ()=>{
        if(newPassword!==confirmnewPassword)
        {
            setErrorMessage("Both Password does not match , Please write correctly");
            setTimeout(() => setErrorMessage(''),2000); 
           return;
        }
        try
        {
             const response=await axios.post('http://localhost:3000/forgotpassword/password',{mail_id:Mail_Id,Password:newPassword});
             if(response.status===200)
             {
                setSuccessfullMessage("Password Change Successfully");
                 setId('');
                 setPassword('');
                 setMailId('');
                 setnewPassword('');
                 setconfirmnewPassword('');
                 setForgotPassword(false);
                 setForgotPasswordWindow(false);
                 setEmailSent(false);
                 setTimeout(() => setSuccessfullMessage(''),2000);
               
             }
             else
             {
                setErrorMessage("Please enter Password with minimum length 8 who contain atleast one special character ,one capital ,one small and one number ");
                setTimeout(() => setErrorMessage(''),5000); 
             }
        }
        catch(e)
        {
            
            setErrorMessage("Please enter Password with minimum length 8 who contain atleast one special character ,one capital ,one small and one number ");
            setTimeout(() => setErrorMessage(''),5000); 
        }
    }
    const handleHome=()=>{
        setId('');
        setPassword('');
        setMailId('');
        setnewPassword('');
        setconfirmnewPassword('');
        setForgotPassword(false);
        setForgotPasswordWindow(false);
        setEmailSent(false);
    }
    const handleClick = () => {
       navigate('/about_us');
      };
    return (
       // console.log(Home),
       <>
        {errorMessage && (
      <div style={styles.errorMessage}>
        {errorMessage}
      </div>
    )}
    {successfulMessage && (<div style={styles.successfulMessage}>{successfulMessage}</div>)}
        <div style={styles.container }>
           
            <div style={styles.formContainer}>
            {ForgotPassword && !ForgotPasswordWindow && !emailSent ? (
        <form onSubmit={handleForgotId} style={styles.form}>
          <h2 style={styles.heading}>Forgot Password</h2>
          <label htmlFor="Mail Id" style={styles.label}>Mail ID:</label>
          <input
            type="text"
            value={Mail_Id}
            onChange={(e) => setMailId(e.target.value)}
            required
            style={styles.input}
          /><br />
          <button type="submit" style={styles.button}>Send Reset Link</button>
          <button type="Back To Home" style={styles.homebutton} onClick={handleHome}>Back To Login Page</button>
        </form>
      ) :!ForgotPasswordWindow && emailSent ? (
        <form onSubmit={handleVerificationCodeSubmit} style={styles.form}>
          <h2 style={styles.heading}>Enter Verification Code</h2>
           <p>A verification code has been sent to {Mail_Id}. Please enter it below.</p>
          <label htmlFor="verificationCode" style={styles.label}>Verification Code:</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            style={styles.input}
          /><br />
          <button type="submit" style={styles.button}>Verify</button>
          <button type="Back To Home" style={styles.homebutton} onClick={handleHome}>Back To Login Page</button>
        </form>
      ) :ForgotPasswordWindow ?(
        <form onSubmit={handlePasswordChange} style={styles.form}>
        <h2 style={styles.heading}>New Password</h2>
        <label htmlFor="newpassword" style={styles.label}>New Password</label>
        <input
          type="text"
          value={newPassword}
          onChange={(e) => setnewPassword(e.target.value)}
          required
          style={styles.input}
        /><br />
         <label htmlFor="confirmnewpassword" style={styles.label}>Confirm New Password</label>
        <input
          type="text"
          value={confirmnewPassword}
          onChange={(e) => setconfirmnewPassword(e.target.value)}
          required
          style={styles.input}
        /><br />
        
        <button type="submit" style={styles.button}>Verify</button>
        <button type="Back To Home" style={styles.homebutton} onClick={handleHome}>Back To Login Page</button>
      </form>
      
      ): isVerification ? (
                    <form onSubmit={handleVerifyCode} style={styles.form}>
                        <h2 style={styles.heading}>Email Verification</h2>
                        <p>A verification code has been sent to {Mail_Id}. Please enter it below.</p>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                            style={styles.input}
                        /><br />
                        <button type="submit" style={styles.button}>Verify</button>
                        <button type="button" onClick={handleResendCode} disabled={!canResend} style={styles.switchButton}>
                            Resend Code {timer > 0 ? `(${timer}s)` : ''}
                        </button>
                        <button type="Back To Home" style={styles.homebutton} onClick={handleHome}>Back To Login Page</button>
                    </form>
                ):
                isSignup ? (
                    <form id="signupForm" onSubmit={handleSignup} style={styles.form}>
                        <h2 style={styles.heading}>SIGN UP</h2>
                        <label htmlFor="Id" style={styles.label}>ID:</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={Id}
                            onChange={(e) => setId(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <label htmlFor="Password" style={styles.label}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <label htmlFor="MailId" style={styles.label}>Mail ID:</label>
                        <input
                            type="email"
                            id="mail_id"
                            name="mail_id"
                            value={Mail_Id}
                            onChange={(e) => setMailId(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <label htmlFor="Education" style={styles.label}>Education:</label>
                        <input
                            type="text"
                            id="education"
                            name="education"
                            value={Education}
                            onChange={(e) => setEducation(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <input type="submit" value="Submit" style={styles.button} />
                        <button type="button" onClick={() => setIsSignup(false)} style={styles.switchButton}>Switch to Login</button>
                    </form>
                ) : (
                    <form id="loginForm" onSubmit={handleSubmit} style={styles.form}>
                        <h2 style={styles.heading}>LOG IN</h2>
                        <label htmlFor="Id" style={styles.label}>ID:</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={Id}
                            onChange={(e) => setId(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <label htmlFor="Password" style={styles.label}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <input type="submit" value="Submit" style={styles.button} />
                        <button type="button" onClick={() => setIsSignup(true)} style={styles.switchButton}>Switch to Sign Up</button>
                        <h3>In case of any query please contact YSExam100@gmail.com</h3>
                        <a 
  href="#" 
  style={{ display: 'flex', justifyContent: 'center' }} 
  onClick={handleForgotPassword}
>
  Forgot Password
</a>
                        <a 
  href="#" 
  style={{ display: 'flex', justifyContent: 'center' }} 
  onClick={handleClick}
>
  About Us
</a>

                    </form>
                )}
            </div>
         

        </div>
        </>);
}

const styles = {
    container: {
        position: 'fixed',  
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `url(${Home}) no-repeat center center`,
        backgroundSize: '100% 100%',  
        margin: 0,
        padding: 0,
        overflow: 'hidden'
    },
    
    errorMessage:{
        position: 'fixed',
  top: '5%',  // Adjust the distance from the top if needed
  left: '50%',
  transform: 'translateX(-50%)',  // Centers horizontally
  width: '30%',
  padding: '1rem',
  backgroundColor: '#f56565',  // Red background
  color: 'white',
  borderRadius: '0.375rem',  // Rounded corners
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'opacity 0.5s',  // Optional transition

    },
     
    successfulMessage:{
        position: 'fixed',
  top: '5%',  // Adjust the distance from the top if needed
  left: '50%',
  transform: 'translateX(-50%)',  // Centers horizontally
  width: '30%',
  padding: '1rem',
  backgroundColor: 'rgba(94, 187, 40, 0.5)',  // Red background
  color: 'white',
  borderRadius: '0.375rem',  // Rounded corners
  boxShadow: '0 4px 6px rgba(169, 236, 96, 0.1)',
  transition: 'opacity 0.5s',  // Optional transition

    },
    formContainer: {
        backgroundColor: 'rgba(221, 229, 239, 0.8)',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(220, 54, 54, 0.1)',
        maxWidth: '400px',
        width: '100%',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    label: {
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        backgroundColor: 'rgba(37, 0, 245, 0.8)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    homebutton: {
        padding: '10px',
        backgroundColor: 'rgba(23, 197, 31, 0.8)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop:'10px',
    },
    switchButton: {
        padding: '10px',
        marginTop: '10px',
        backgroundColor: '#f1f1f1',
        border: '1px solid #ccc',
        cursor: 'pointer',
    },
};

export default Index;
