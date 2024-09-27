// src/components/CourseEdit.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Spinner } from 'react-bootstrap';
import CourseAdd from './CourseAdd';
import axios from 'axios';


const API_BASE_URL = 'http://localhost:3000/api';

const getCourse = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/courses/${id}`, { withCredentials: true });
  return response.data;
};

const updateCourse = async (id: string, courseData: any) => {
  const response = await axios.put(`${API_BASE_URL}/courses/${id}`, courseData, { withCredentials: true });
  return response.data;
};
const CourseEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await getCourse(id!);
        setCourse(courseData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch course data. Please try again.');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleSubmit = async (courseData: any) => {
    try {
      await updateCourse(id!, courseData);
      navigate('/course/list');
    } catch (err) {
      setError('Failed to update course. Please try again.');
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <CourseAdd
      id={id}
      initialCourse={course}
      onSubmit={handleSubmit}
      title="Edit Course"
    />
  );
};


export default CourseEdit;