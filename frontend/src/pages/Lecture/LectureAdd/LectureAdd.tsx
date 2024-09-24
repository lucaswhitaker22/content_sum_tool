import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LectureAdd: React.FC = () => {
  const [format, setFormat] = useState('Lecture');
  const [date, setDate] = useState('');
  const [course, setCourse] = useState('');
  const [title, setTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string>('');
  const navigate = useNavigate();

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
        format,
        date,
        course,
        title,
        path: pdfUrl
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
      await axios.post('http://localhost:3000/api/lectures', generatedData);
      setSaveStatus('success');
      setSaveMessage('Lecture saved successfully!');
      setTimeout(() => navigate('/lectures'), 2000);
    } catch (error) {
      console.error('Error saving lecture:', error);
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'An error occurred while saving the lecture');
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
          <Form.Control
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Enter course code"
            required
          />
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