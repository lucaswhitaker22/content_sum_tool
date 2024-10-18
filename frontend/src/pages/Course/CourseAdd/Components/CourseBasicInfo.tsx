import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { Course } from '../../../../interfaces/Course.interface';

interface CourseBasicInfoProps {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}

const CourseBasicInfo: React.FC<CourseBasicInfoProps> = ({ course, setCourse }) => {
  const terms = ['Spring', 'Summer', 'Fall', 'Winter'];

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setCourse((prevCourse: any) => ({
      ...prevCourse,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  return (
    <>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={course.department}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Number</Form.Label>
            <Form.Control
              type="text"
              name="number"
              value={course.number}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={course.title}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Professor</Form.Label>
        <Form.Control
          type="text"
          name="professor"
          value={course.professor}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Term</Form.Label>
            <Form.Select name="term" value={course.term} onChange={handleInputChange}>
              <option>Select a term</option>
              {terms.map((term) => (
                <option key={term} value={term}>{term}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={course.year}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group>
        <Form.Label>Outline URL</Form.Label>
        <Form.Control
          type="text"
          name="outlineUrl"
          value={course.outlineUrl}
          onChange={handleInputChange}
        />
      </Form.Group>
    </>
  );
};

export default CourseBasicInfo;