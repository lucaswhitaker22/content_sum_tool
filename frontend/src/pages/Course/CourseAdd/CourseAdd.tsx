import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Course } from '../Course.interface';
import CourseBasicInfo from './Components/CourseBasicInfo';
import GradingScheme from './Components/GradingScheme';
import ScheduleComponent from './Components/ScheduleComponent';

interface CourseAddProps {
  id?: string;
  initialCourse?: Course;
  onSubmit?: (courseData: Course) => Promise<void>;
  title?: string;
}

const CourseAdd: React.FC<CourseAddProps> = ({
  id: propId,
  initialCourse,
  onSubmit,
  title
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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setStatus('loading');
      const response = await axios.get(`http://localhost:3000/api/courses/${id}`);
      setCourse(response.data);
      setStatus('success');
    } catch (error) {
      console.error('Failed to fetch course data:', error);
      setStatus('error');
      setMessage('Failed to fetch course data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage(null);
    try {
      const courseData: Partial<Course> = { ...course };
      if (!id) delete courseData._id;
      courseData.gradingScheme = courseData.gradingScheme?.map(item => ({
        item: item.item,
        weight: Number(item.weight)
      }));
      
      if (id) {
        await axios.put(`http://localhost:3000/api/courses/${id}`, courseData);
        setMessage('Course updated successfully!');
      } else {
        const response = await axios.post('http://localhost:3000/api/courses', courseData);
        setMessage('Course created successfully!');
        setCourse(response.data);
      }
      
      setStatus('success');
      setTimeout(() => navigate('/course/list'), 2000);
    } catch (error) {
      console.error('Error saving course:', error);
      setStatus('error');
      setMessage('Failed to save course. Please try again.');
    }
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">{id ? 'Edit Course' : 'Add New Course'}</h2>
      
      {status === 'loading' && <Spinner animation="border" role="status" />}
      
      {message && (
        <Alert variant={status === 'error' ? 'danger' : 'success'}>{message}</Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <CourseBasicInfo course={course} setCourse={setCourse} />
          </Col>
          <Col md={6}>
            <GradingScheme 
              gradingScheme={course.gradingScheme} 
              setGradingScheme={(newScheme) => setCourse({...course, gradingScheme: newScheme})} 
            />
          </Col>
        </Row>
        
        <ScheduleComponent 
          schedule={course.schedule} 
          setSchedule={(newSchedule) => setCourse({...course, schedule: newSchedule})} 
        />
        
        <div className="d-flex justify-content-end mt-4">
          <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/course/list')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {id ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CourseAdd;