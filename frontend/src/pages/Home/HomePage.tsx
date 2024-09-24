import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

interface User {
  displayName: string;
  // Add other user properties as needed
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const routes = [
    { path: '/lectures', name: 'Lecture List', description: 'View all lectures' },
    { path: '/lecture/new', name: 'New Lecture', description: 'Create a new lecture' },
    // Add more routes as needed
  ];

  useEffect(() => {
    // Check if user is authenticated
    fetch('http://localhost:3000/api/user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    fetch('http://localhost:3000/api/logout', { credentials: 'include' })
      .then(() => {
        setUser(null);
        navigate('/login');
      })
      .catch(error => console.error('Error logging out:', error));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Lecture Management System</h1>
      <p className="text-center mb-4">Welcome, {user.displayName}!</p>
      <Row>
        {routes.map((route, index) => (
          <Col key={index} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{route.name}</Card.Title>
                <Card.Text>{route.description}</Card.Text>
                <Button as={Link as any} to={route.path} variant="primary">
                  Go to {route.name}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-4">
        <Button onClick={handleLogout} variant="secondary">Logout</Button>
      </div>
    </Container>
  );
};

export default HomePage;