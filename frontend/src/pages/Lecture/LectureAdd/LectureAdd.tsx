import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Course {
  _id: string;
  department: string;
  number: string;
  title: string;
}

interface LectureMetadata {
  format: string;
  date: string;
  course: string;
  title: string;
  path: string;
}

interface Lecture {
  _id?: string;
  metadata: LectureMetadata;
}

interface LectureAddProps {
  initialLecture?: Lecture;
  onSubmit?: (lectureData: Lecture) => Promise<void>;
  isEditing?: boolean;
}

const LectureAdd: React.FC<LectureAddProps> = ({ initialLecture, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture>(initialLecture || {
    metadata: {
      format: 'Lecture',
      date: new Date().toISOString().split('T')[0],
      course: '',
      title: '',
      path: ''
    }
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get<Course[]>('http://localhost:3000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLecture((prevLecture: Lecture) => ({
      ...prevLecture,
      metadata: {
        ...prevLecture.metadata,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      if (onSubmit) {
        await onSubmit(lecture);
      } else {
        // Default behavior for adding a new lecture
        await axios.post('http://localhost:3000/api/lectures', lecture);
      }
      setStatus('success');
      setMessage(isEditing ? 'Lecture updated successfully!' : 'Lecture added successfully!');
      setTimeout(() => navigate('/lectures'), 2000);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header as="h2">{isEditing ? 'Edit Lecture' : 'Add New Lecture'}</Card.Header>
        <Card.Body>
          {status === 'loading' && (
            <Alert variant="info">
              <Spinner animation="border" size="sm" /> {isEditing ? 'Updating' : 'Adding'} lecture...
            </Alert>
          )}
          {status === 'success' && <Alert variant="success">{message}</Alert>}
          {status === 'error' && <Alert variant="danger">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formatInput">
                  <Form.Label>Format</Form.Label>
                  <Form.Control
                    type="text"
                    name="format"
                    value={lecture.metadata.format}
                    onChange={handleInputChange}
                    placeholder="Enter format (e.g., Lecture, Lab, Tutorial)"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="dateInput">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={lecture.metadata.date.split('T')[0]}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="courseInput">
              <Form.Label>Course</Form.Label>
              <Form.Select
                name="course"
                value={lecture.metadata.course}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.department} {course.number}: {course.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="titleInput">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={lecture.metadata.title}
                onChange={handleInputChange}
                placeholder="Enter lecture title"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pdfUrlInput">
              <Form.Label>PDF URL</Form.Label>
              <Form.Control
                type="url"
                name="path"
                value={lecture.metadata.path}
                onChange={handleInputChange}
                placeholder="Enter PDF URL"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={status === 'loading'}>
              {isEditing ? 'Update Lecture' : 'Add Lecture'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LectureAdd;