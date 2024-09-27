import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Lecture } from '../Lecture.interface';
import {LectureNotes, LectureHeader, LecturePractice, LectureKeywords, LectureReview} from './LectureView.components';
import  {PrintButton} from '../LecturePrint/PrintButton';

axios.defaults.withCredentials = true;

const LectureView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const response = await axios.get<Lecture>(`http://localhost:3000/api/lectures/${id}`);
        setLecture(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch lecture data');
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

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
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!lecture) {
    return (
      <Container>
        <Alert variant="warning">Lecture not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <LectureHeader metadata={lecture.metadata} />
      <Row>
        <Col md={8}>
          <LectureNotes notes={lecture.notes} />
        </Col>
        <Col md={4}>
          <LectureReview review={lecture.review} />
          <LectureKeywords keywords={lecture.keywords} />
        </Col>
      </Row>
      <LecturePractice practice={lecture.practice} />
      <PrintButton lecture={lecture} />
    </Container>

  );
};

export default LectureView;