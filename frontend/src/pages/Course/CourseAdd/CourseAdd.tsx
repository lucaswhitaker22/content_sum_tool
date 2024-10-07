import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      setError('Failed to fetch course data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const courseData: Partial<Course> = { ...course };
      if (!id) {
        delete courseData._id;
      }
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
    <Container>
      <h2>{id ? 'Edit Course' : 'Add New Course'}</h2>
      <Form onSubmit={handleSubmit}>
        <CourseBasicInfo course={course} setCourse={setCourse} />
        <GradingScheme 
          gradingScheme={course.gradingScheme} 
          setGradingScheme={(newScheme) => setCourse({...course, gradingScheme: newScheme})} 
        />
        <ScheduleComponent 
          schedule={course.schedule} 
          setSchedule={(newSchedule) => setCourse({...course, schedule: newSchedule})} 
        />
        <Button type="submit">{id ? 'Update Course' : 'Create Course'}</Button>
      </Form>
    </Container>
  );
};

export default CourseAdd;