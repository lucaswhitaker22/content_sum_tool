import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { Lecture } from '../../../interfaces/Lecture.interface';

interface LectureFiltersProps {
  lectures: Lecture[];
  courseFilter: string;
  setCourseFilter: (filter: string) => void;
  formatFilter: string;
  setFormatFilter: (filter: string) => void;
}

const LectureFilters: React.FC<LectureFiltersProps> = ({
  lectures,
  courseFilter,
  setCourseFilter,
  formatFilter,
  setFormatFilter,
}) => {
  const uniqueCourses = Array.from(
    new Map(lectures.map(lecture => [lecture.metadata.course._id, lecture.metadata.course]))
  ).map(([_, course]) => course);
  const uniqueFormats = Array.from(new Set(lectures.map(lecture => lecture.metadata.format)));

  return (
    <Row className="mb-3">
      <Col md={6}>
        <Form.Select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option value="">All Courses</option>
          {uniqueCourses.map(course => (
            <option key={course._id} value={course._id}>
              {course.department} {course.number}: {course.title}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col md={6}>
        <Form.Select
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
        >
          <option value="">All Formats</option>
          {uniqueFormats.map(format => (
            <option key={format} value={format}>{format}</option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  );
};

export default LectureFilters;