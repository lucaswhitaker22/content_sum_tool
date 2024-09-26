import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Course } from './Course.interface'

const CourseEdit: React.FC = () => {
  const [course, setCourse] = useState<Course>({
    _id:'',
    department: '',
    number: '',
    professor: '',
    term: '',
    year: new Date().getFullYear(),
    title: '',
    gradingScheme: [],
    outlineUrl: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const terms = ['Spring', 'Summer', 'Fall', 'Winter'];

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/courses/${id}`, { withCredentials: true });
      setCourse(response.data);
    } catch (error) {
      setError('Failed to fetch course data');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleGradingSchemeChange = (index: number, field: 'item' | 'weight', value: string) => {
    const updatedScheme = [...(course.gradingScheme || [])];
    updatedScheme[index] = { ...updatedScheme[index], [field]: field === 'weight' ? parseFloat(value) : value };
    setCourse({ ...course, gradingScheme: updatedScheme });
  };

  const addGradingSchemeItem = () => {
    setCourse({ ...course, gradingScheme: [...(course.gradingScheme || []), { item: '', weight: 0 }] });
  };

  const removeGradingSchemeItem = (index: number) => {
    const updatedScheme = [...(course.gradingScheme || [])];
    updatedScheme.splice(index, 1);
    setCourse({ ...course, gradingScheme: updatedScheme });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.put(`http://localhost:3000/api/courses/${id}`, course, { withCredentials: true });
      setSuccess('Course updated successfully!');
      setTimeout(() => navigate('/courses'), 2000);
    } catch (error) {
      setError('Failed to update course. Please try again.');
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header as="h2">Edit Course</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDepartment">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={course.department}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formNumber">
                  <Form.Label>Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="number"
                    value={course.number}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={course.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProfessor">
              <Form.Label>Professor</Form.Label>
              <Form.Control
                type="text"
                name="professor"
                value={course.professor}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formTerm">
                  <Form.Label>Term</Form.Label>
                  <Form.Select
                    name="term"
                    value={course.term}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a term</option>
                    {terms.map((term) => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formYear">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    value={course.year}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formOutlineUrl">
              <Form.Label>Outline URL</Form.Label>
              <Form.Control
                type="url"
                name="outlineUrl"
                value={course.outlineUrl}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Grading Scheme</Form.Label>
              {course.gradingScheme?.map((item, index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <Form.Control
                      type="text"
                      value={item.item}
                      onChange={(e) => handleGradingSchemeChange(index, 'item', e.target.value)}
                      placeholder="Item"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      value={item.weight}
                      onChange={(e) => handleGradingSchemeChange(index, 'weight', e.target.value)}
                      placeholder="Weight (%)"
                    />
                  </Col>
                  <Col xs="auto">
                    <Button variant="danger" onClick={() => removeGradingSchemeItem(index)}>Remove</Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={addGradingSchemeItem} className="mt-2">
                Add Grading Item
              </Button>
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Course
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CourseEdit;