import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Table, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Course, ScheduleItem } from './Course.interface'
import TimePicker from 'react-time-picker';
import Select from 'react-select';
interface CourseAddProps {
  id?: string;
  initialCourse?: any;
  onSubmit?: (courseData: any) => Promise<void>;
  title?: string;
}
const CourseAdd: React.FC<CourseAddProps> = ({
}) => {
  const [course, setCourse] = useState<Course>({
    _id: '',
    department: '',
    number: '',
    professor: '',
    term: '',
    year: new Date().getFullYear(),
    title: '',
    gradingScheme: [],
    outlineUrl: '',
    schedule: []
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const terms = ['Spring', 'Summer', 'Fall', 'Winter'];

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: any) => {
    const updatedSchedule = [...course.schedule];
    if (field === 'dayOfWeek') {
      updatedSchedule[index][field] = value; // Now value is just a string
    } else {
      updatedSchedule[index][field] = value;
    }
    setCourse({ ...course, schedule: updatedSchedule });
  };
  
  const addScheduleItem = () => {
    setCourse({
      ...course,
      schedule: [...course.schedule, { dayOfWeek: '', startTime: '', endTime: '', location: '', type: '' }],
    });
  };
  
  const removeScheduleItem = (index: number) => {
    const updatedSchedule = [...course.schedule];
    updatedSchedule.splice(index, 1);
    setCourse({ ...course, schedule: updatedSchedule });
  };

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);


  interface DayOption {
    value: string;
    label: string;
  }
  
  const daysOfWeek: DayOption[] = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ];
  
 

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
{/* Grading Scheme Section */}
<Card className="mt-4 mb-4">
  <Card.Header>Grading Scheme</Card.Header>
  <Card.Body>
    <Table striped bordered hover>
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
              <Form.Control
                type="number"
                value={item.weight}
                onChange={(e) => handleGradingSchemeChange(index, 'weight', e.target.value)}
                placeholder="Weight"
              />
            </td>
            <td>
              <Button variant="danger" onClick={() => removeGradingSchemeItem(index)}>
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Button variant="secondary" onClick={addGradingSchemeItem}>
      Add Grading Item
    </Button>
  </Card.Body>
</Card>
  <Form.Label>Schedule</Form.Label>
{/* Schedule Section */}
<Card className="mt-4 mb-4">
  <Card.Header>Schedule</Card.Header>
  <Card.Body>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Day of Week</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Location</th>
          <th>Type</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {course.schedule?.map((item, index) => (
          <tr key={index}>
  <td>
  <Select
    options={daysOfWeek}
    value={daysOfWeek.find(day => day.value === item.dayOfWeek)}
    onChange={(selectedOption) => handleScheduleChange(index, 'dayOfWeek', selectedOption ? selectedOption.value : '')}
  />
</td>
            <td>
              <Form.Control
                type="text"
                value={item.startTime}
                onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                placeholder="HH:MM"
              />
            </td>
            <td>
              <Form.Control
                type="text"
                value={item.endTime}
                onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                placeholder="HH:MM"
              />
            </td>
            <td>
              <Form.Control
                type="text"
                value={item.location}
                onChange={(e) => handleScheduleChange(index, 'location', e.target.value)}
                placeholder="Location"
              />
            </td>
            <td>
              <Form.Select
                value={item.type}
                onChange={(e) => handleScheduleChange(index, 'type', e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab</option>
                <option value="Tutorial">Tutorial</option>
              </Form.Select>
            </td>
            <td>
              <Button variant="danger" onClick={() => removeScheduleItem(index)}>
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Button variant="secondary" onClick={addScheduleItem}>
      Add Schedule Item
    </Button>
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