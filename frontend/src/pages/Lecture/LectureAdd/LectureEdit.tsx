import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import LectureAdd from './LectureAdd';

const LectureEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/lectures/${id}`);
        setLecture(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lecture:', err);
        setError('Failed to fetch lecture data. Please try again.');
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  const handleSubmit = async (lectureData: any) => {
    try {
      await axios.put(`http://localhost:3000/api/lectures/${id}`, lectureData);
      navigate('/lectures');
    } catch (err) {
      console.error('Error updating lecture:', err);
      setError('Failed to update lecture. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <LectureAdd
      initialLecture={lecture}
      onSubmit={handleSubmit}
      isEditing={true}
    />
  );
};

export default LectureEdit;