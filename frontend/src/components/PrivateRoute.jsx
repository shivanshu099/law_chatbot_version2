import React, { Children } from 'react'

const PrivateRoute = ({children}) => {
    const token = localStorage.getItem("Token");
    if(!token){
        alert("You must be logged in to access this page......");
        return null;
    }
    return <>children</>;
};

export default PrivateRoute






































