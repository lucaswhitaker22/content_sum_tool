import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-5">Welcome to StudyAI</h1>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Generate Lectures</Card.Title>
              <Card.Text>
                Create new lectures using our AI-powered generator.
              </Card.Text>
              <Link to="/lecture/add" className="btn btn-primary">
                Generate Lecture
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>View Lectures</Card.Title>
              <Card.Text>
                Browse and manage your existing lectures.
              </Card.Text>
              <Link to="/lecture/list" className="btn btn-primary">
                View Lectures
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Manage Courses</Card.Title>
              <Card.Text>
                View and manage your courses.
              </Card.Text>
              <Link to="/course/list" className="btn btn-primary">
                View Courses
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;