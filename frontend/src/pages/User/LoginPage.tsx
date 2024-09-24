import React from 'react';
import { Container, Button } from 'react-bootstrap';

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Button onClick={handleGoogleLogin} variant="primary" size="lg">
        Login with Google
      </Button>
    </Container>
  );
};

export default LoginPage;