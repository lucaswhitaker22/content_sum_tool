import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Table, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Course } from './Course.interface'
interface CourseAddProps {
  id?: string;
  initialCourse?: any;
  onSubmit?: (courseData: any) => Promise<void>;
  title?: string;
}
const CourseAdd: React.FC<CourseAddProps> = ({
}) => {
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      setError('Failed to fetch course data');
    }
  };

  const handleGradingSchemeChange = (index: number, field: 'item' | 'weight', value: string) => {
    const updatedScheme = [...course.gradingScheme];
    updatedScheme[index] = { 
      ...updatedScheme[index], 
      [field]: field === 'weight' ? parseFloat(value) : value 
    };
    setCourse({ ...course, gradingScheme: updatedScheme });
  };

  const addGradingSchemeItem = () => {
    setCourse({ ...course, gradingScheme: [...course.gradingScheme, { item: '', weight: 0 }] });
  };

  const removeGradingSchemeItem = (index: number) => {
    const updatedScheme = [...course.gradingScheme];
    updatedScheme.splice(index, 1);
    setCourse({ ...course, gradingScheme: updatedScheme });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const courseData: Partial<Course> = { ...course };
      if (!id) {
        delete courseData._id; // Remove _id for new courses
      }

      // Ensure gradingScheme is properly formatted
      courseData.gradingScheme = courseData.gradingScheme?.map(item => ({
        item: item.item,
        weight: Number(item.weight)
      }));

      if (id) {
        await axios.put(`http://localhost:3000/api/courses/${id}`, courseData);
        setSuccess('Course updated successfully!');
      } else {
        const response = await axios.post('http://localhost:3000/api/courses', courseData);
        setSuccess('Course created successfully!');
        setCourse(response.data);
      }
      setTimeout(() => navigate('/course/list'), 2000);
    } catch (error) {
      setError('Failed to save course. Please try again.');
      console.error('Error saving course:', error);
    }
  };
  return (
    <Container className="py-4">
      <Card>
        <Card.Header as="h2">{id ? 'Edit Course' : 'Add New Course'}</Card.Header>
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
  <Card>
    <Card.Body>
      <Table responsive>
        <thead>
          <tr>
            <th>Item</th>
            <th>Weight (%)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {course.gradingScheme?.map((item, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  value={item.item}
                  onChange={(e) => handleGradingSchemeChange(index, 'item', e.target.value)}
                  placeholder="Item"
                />
              </td>
              <td>
                <InputGroup>
                  <Form.Control
                    type="number"
                    value={item.weight}
                    onChange={(e) => handleGradingSchemeChange(index, 'weight', e.target.value)}
                    placeholder="Weight"
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </td>
              <td>
                <Button variant="outline-danger" size="sm" onClick={() => removeGradingSchemeItem(index)}>
                  <i className="bi bi-trash"></i> Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-end mt-3">
        <Button variant="outline-primary" onClick={addGradingSchemeItem}>
          <i className="bi bi-plus"></i> Add Grading Item
        </Button>
      </div>
    </Card.Body>
  </Card>
</Form.Group>
            <Button variant="primary" type="submit">
              {id ? 'Update Course' : 'Create Course'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CourseAdd;