import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { LectureMetadata } from '../../../../interfaces/Lecture.interface';

interface Course {
  _id: string;
  department: string;
  number: string;
  title: string;
}
interface Lecture {
  _id?: string;
  metadata: LectureMetadata;
}

interface LectureFormProps {
  lecture: Lecture;
  courses: Course[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  status: 'idle' | 'loading' | 'success' | 'error';
  navigate: (path: string) => void;
}

const LectureForm: React.FC<LectureFormProps> = ({
  lecture,
  courses,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  status,
  navigate
}) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="formatInput">
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
          <Form.Group controlId="dateInput">
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

      {!lecture.metadata.path && (
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

      <div className="d-flex justify-content-end mt-4">
        <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/lecture/list')}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={status === 'loading'}>
          Generate Lecture
        </Button>
      </div>
    </Form>
  );
};

export default LectureForm;