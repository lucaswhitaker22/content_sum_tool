import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

interface Course {
  _id: string;
  department: string;
  number: string;
  title: string;
}

const LectureAdd: React.FC = () => {
  const [format, setFormat] = useState('Lecture');
  const [date, setDate] = useState('');
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'loading') {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(timer);
  }, [status]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    setGeneratedData(null);
    setSaveStatus('idle');
    setSaveMessage('');

    try {
      if (!pdfUrl) {
        throw new Error('Please provide a PDF URL');
      }

      const requestBody = {
        metadata: {
          format,
          date,
          course: courseId,
          title,
          path: pdfUrl
        }
      };

      const response = await axios.post('http://localhost:3000/api/generate-lecture', requestBody);
      setStatus('success');
      setMessage('Lecture generated successfully!');
      setGeneratedData(response.data);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleSave = async () => {
    if (!generatedData) return;
  
    setSaveStatus('idle');
    setSaveMessage('');
  
    try {
      const lectureData = {
        ...generatedData,
        metadata: {
          ...generatedData.metadata,
          format: format,
          date: new Date(date),
          course: courseId,
          title: title,
          path: pdfUrl
        }
      };
  
      const response = await axios.post('http://localhost:3000/api/lectures', lectureData);
      
      setSaveStatus('success');
      setSaveMessage('Lecture saved successfully!');
      setTimeout(() => navigate('/lectures'), 2000);
    } catch (error) {
      console.error('Error saving lecture:', error);
      setSaveStatus('error');
      if (axios.isAxiosError(error) && error.response) {
        setSaveMessage(error.response.data.message || 'An error occurred while saving the lecture');
      } else {
        setSaveMessage('An unexpected error occurred');
      }
    }
  };

  const renderStatusMessage = () => {
    switch (status) {
      case 'loading':
        return (
          <Alert variant="info">
            <Spinner animation="border" size="sm" /> Generating lecture... (Elapsed time: {elapsedTime}s)
          </Alert>
        );
      case 'success':
        return <Alert variant="success">{message}</Alert>;
      case 'error':
        return <Alert variant="danger">{message}</Alert>;
      default:
        return null;
    }
  };

  const renderSaveMessage = () => {
    switch (saveStatus) {
      case 'success':
        return <Alert variant="success">{saveMessage}</Alert>;
      case 'error':
        return <Alert variant="danger">{saveMessage}</Alert>;
      default:
        return null;
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Generate New Lecture</h2>
      {renderStatusMessage()}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formatInput">
          <Form.Label>Format</Form.Label>
          <Form.Control
            type="text"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            placeholder="Enter format (default: Lecture)"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="dateInput">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="courseInput">
          <Form.Label>Course</Form.Label>
          <Form.Select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lecture title"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="pdfUrlInput">
          <Form.Label>PDF URL</Form.Label>
          <Form.Control
            type="url"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="Enter PDF URL"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              <Spinner animation="border" size="sm" /> Generating Lecture...
            </>
          ) : (
            'Generate Lecture'
          )}
        </Button>
      </Form>
      {generatedData && (
        <div className="mt-4">
          <h3>Generated Lecture Data:</h3>
          <pre>{JSON.stringify(generatedData, null, 2)}</pre>
          {renderSaveMessage()}
          <Button variant="success" onClick={handleSave} className="mt-3" disabled={saveStatus === 'success'}>
            {saveStatus === 'success' ? 'Lecture Saved' : 'Save Lecture'}
          </Button>
        </div>
      )}
    </Container>
  );
};

export default LectureAdd;