import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Course {
  _id: string;
  department: string;
  number: string;
  title: string;
}

interface LectureMetadata {
  format: string;
  date: string;
  course: string;
  title: string;
  path: string;
}

interface Lecture {
  _id?: string;
  metadata: LectureMetadata;
}

interface LectureAddProps {
  initialLecture?: Lecture;
  onSubmit?: (lectureData: Lecture) => Promise<void>;
  isEditing?: boolean;
}

const LectureAdd: React.FC<LectureAddProps> = ({ initialLecture, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture>(initialLecture || {
    metadata: {
      format: 'Lecture',
      date: new Date().toISOString().split('T')[0],
      course: '',
      title: '',
      path: ''
    }
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

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

  const setDateToNoon = (dateString: string): string => {
    const date = new Date(dateString);
    date.setHours(12, 0, 0, 0);
    return date.toISOString();
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get<Course[]>('http://localhost:3000/api/courses', { withCredentials: true });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLecture((prevLecture: Lecture) => ({
      ...prevLecture,
      metadata: {
        ...prevLecture.metadata,
        [name]: value
      }
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  };

  const uploadPdf = async () => {
    if (!pdfFile) {
      throw new Error('No PDF file selected');
    }
  
    const formData = new FormData();
    formData.append('pdf', pdfFile);
  
    try {
      const response = await axios.post('http://localhost:3000/api/upload-pdf', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.fileUrl; // This is now the direct URL to the PDF
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    setGeneratedData(null);
  
    try {
      let pdfUrl = lecture.metadata.path;
      if (pdfFile) {
        pdfUrl = await uploadPdf();
        setLecture(prevLecture => ({
          ...prevLecture,
          metadata: {
            ...prevLecture.metadata,
            path: pdfUrl
          }
        }));
      }
  
      if (!pdfUrl) {
        throw new Error('PDF file or URL is required');
      }
  
      const requestBody = {
        metadata: {
          ...lecture.metadata,
          path: pdfUrl,
          date: setDateToNoon(lecture.metadata.date) // Set the date to noon
        }
      };
  
      console.log('Sending request body:', requestBody);
      const response = await axios.post('http://localhost:3000/api/generate-lecture', requestBody, {
        withCredentials: true,
      });
  
      setStatus('success');
      setMessage('Lecture generated successfully!');
      setGeneratedData(response.data);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      if (axios.isAxiosError(error) && error.response) {
        setMessage(`Error: ${error.response.status} - ${error.response.data.message || error.message}`);
      } else {
        setMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    }
  };

  const handleSave = async () => {
    if (!generatedData) return;

    try {
      const lectureData = {
        ...generatedData,
        metadata: {
          ...generatedData.metadata,
          format: lecture.metadata.format,
          date: lecture.metadata.date,
          course: lecture.metadata.course,
          title: lecture.metadata.title,
        }
      };

      if (onSubmit) {
        await onSubmit(lectureData);
      } else {
        await axios.post('http://localhost:3000/api/lectures', lectureData, { withCredentials: true });
      }
      setStatus('success');
      setMessage(isEditing ? 'Lecture updated successfully!' : 'Lecture added successfully!');
      setTimeout(() => navigate('/lectures'), 2000);
    } catch (error) {
      console.error('Error saving lecture:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header as="h2">{isEditing ? 'Edit Lecture' : 'Add New Lecture'}</Card.Header>
        <Card.Body>
          {status === 'loading' && (
            <Alert variant="info">
              <Spinner animation="border" size="sm" /> Generating lecture... (Elapsed time: {elapsedTime}s)
            </Alert>
          )}
          {status === 'success' && <Alert variant="success">{message}</Alert>}
          {status === 'error' && <Alert variant="danger">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formatInput">
                  <Form.Label>Format</Form.Label>
                  <Form.Control
                    type="text"
                    name="format"
                    value={lecture.metadata.format}
                    onChange={handleInputChange}
                    placeholder="Enter format (e.g., Lecture, Lab, Tutorial)"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="dateInput">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={lecture.metadata.date.split('T')[0]}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="courseInput">
              <Form.Label>Course</Form.Label>
              <Form.Select
                name="course"
                value={lecture.metadata.course}
                onChange={handleInputChange}
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
                name="title"
                value={lecture.metadata.title}
                onChange={handleInputChange}
                placeholder="Enter lecture title"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pdfFileInput">
              <Form.Label>PDF File</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
              />
            </Form.Group>
            {!pdfFile && (
              <Form.Group className="mb-3" controlId="pdfUrlInput">
                <Form.Label>PDF URL (if not uploading a file)</Form.Label>
                <Form.Control
                  type="url"
                  name="path"
                  value={lecture.metadata.path}
                  onChange={handleInputChange}
                  placeholder="Enter PDF URL"
                />
              </Form.Group>
            )}
            <Button variant="primary" type="submit" disabled={status === 'loading'}>
              Generate Lecture
            </Button>
          </Form>
          {generatedData && (
            <div className="mt-4">
              <h3>Generated Lecture Data:</h3>
              <pre>{JSON.stringify(generatedData, null, 2)}</pre>
              <Button variant="success" onClick={handleSave} className="mt-3">
                {isEditing ? 'Update Lecture' : 'Save Lecture'}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LectureAdd;