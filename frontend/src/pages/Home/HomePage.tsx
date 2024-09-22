import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const HomePage: React.FC = () => {
  const routes = [
    { path: '/lectures', name: 'Lecture List', description: 'View all lectures' },
    { path: '/lecture/new', name: 'New Lecture', description: 'Create a new lecture' },
    // Add more routes as needed
  ];

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Lecture Management System</h1>
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
    </Container>
  );
};

export default HomePage;