import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin()
{
    const navigate=useNavigate();
    const handle1 = () => {
        console.log("Navigating to Change Password");
        navigate('/change_password');
    };
    
    const handle2 = () => {
        console.log("Navigating to Add Another Person");
        navigate('/add_another');
    };
    
    return(
        <>
        <button onClick={handle1}>Change Password</button>
        <button onClick={handle2}>Add Another Person</button>
        </>
    );
}

export default Admin;