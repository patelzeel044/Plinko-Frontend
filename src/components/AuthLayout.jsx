import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import Loading from "./Loading";

export function AuthLayout({ children, authentication, admin }) {
    //const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);
    const loading = useSelector((state) => state.auth.loading);
    const user = useSelector((state) => state.auth.userData);
  
     /* useEffect(() => {
       if (authentication && authStatus !== authentication) {
        navigate("/login");
      } 
      if (admin && user?.role !== 'admin') {
        navigate("/");
      }
    }, [authStatus, authentication, navigate, admin, user]);  */
  
     if (loading) {
    return <Loading/>;
  }


    if ((authentication && authStatus !== authentication) || (admin && user?.role !== 'admin')) {
      return <LoginPopup />;
    }
    
    return children;
  }