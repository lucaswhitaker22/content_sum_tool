import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AuthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Save the token to local storage
      localStorage.setItem('authToken', token);
      
      // Redirect to the home page
      navigate('/');
    } else {
      // If no token is present, redirect to login page
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div>
      <h2>Authentication Successful</h2>
      <p>Redirecting to home page...</p>
    </div>
  );
}

export default AuthSuccess;