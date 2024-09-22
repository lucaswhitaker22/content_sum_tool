import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LectureAdd: React.FC = () => {
  const [format, setFormat] = useState('Lecture');
  const [date, setDate] = useState('');
  const [course, setCourse] = useState('');
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [generatedData, setGeneratedData] = useState<any>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    setGeneratedData(null);

    try {
      if (!pdfFile) {
        throw new Error('No PDF file selected');
      }

      // Read the PDF file as a data URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        const pdfDataUrl = reader.result as string;

        // Simulate creating a temporary URL by using the data URL directly
        const requestBody = {
          format,
          date,
          course,
          title,
          path: pdfDataUrl // Use the data URL as the path
        };

        const response = await axios.post('http://localhost:3000/api/generate-lecture', requestBody);
        setStatus('success');
        setMessage('Lecture generated successfully!');
        setGeneratedData(response.data);
      };
      reader.readAsDataURL(pdfFile);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleSave = async () => {
    if (!generatedData) return;

    try {
      await axios.post('http://localhost:3000/api/lectures', generatedData);
      navigate('/home');
    } catch (error) {
      console.error('Error saving lecture:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred while saving the lecture');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  };

  const renderStatusMessage = () => {
    switch (status) {
      case 'loading':
        return (
          <Alert variant="info">
            <Spinner animation="border" size="sm" /> Generating lecture...
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
        <Form.Group className="mb-3" controlId="pdfInput">
          <Form.Label>PDF File</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
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
          <Button variant="success" onClick={handleSave} className="mt-3">
            Save Lecture
          </Button>
        </div>
      )}
    </Container>
  );
};

export default LectureAdd;