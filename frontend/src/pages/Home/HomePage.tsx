import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-5">Welcome to LectureGPT</h1>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Generate Lectures</Card.Title>
              <Card.Text>
                Create new lectures using our AI-powered generator.
              </Card.Text>
              <Link to="/lectures/add" className="btn btn-primary">
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
              <Link to="/lectures" className="btn btn-primary">
                View Lectures
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>About LectureGPT</Card.Title>
              <Card.Text>
                Learn more about our AI-powered lecture generation tool.
              </Card.Text>
              <Link to="/about" className="btn btn-primary">
                Learn More
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;