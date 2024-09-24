import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Table, Button, Row, Col } from 'react-bootstrap';
import { ChevronUp, ChevronDown } from 'react-bootstrap-icons';
axios.defaults.withCredentials = true;
interface Lecture {
  _id: string;
  metadata: {
    title: string;
    course: string;
    date: string;
    format: string;
  };
}

const LectureList: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([]);
  const [courseFilter, setCourseFilter] = useState<string>('');
  const [formatFilter, setFormatFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Lecture['metadata']>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchLectures();
  }, []);

  useEffect(() => {
    filterAndSortLectures();
  }, [courseFilter, formatFilter, sortBy, sortOrder, lectures]);

  const fetchLectures = async () => {
    try {
      const response = await axios.get<Lecture[]>('http://localhost:3000/api/lectures');
      setLectures(response.data);
      setFilteredLectures(response.data);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const filterAndSortLectures = () => {
    let filtered = lectures.filter(lecture => 
      (courseFilter === '' || lecture.metadata.course === courseFilter) &&
      (formatFilter === '' || lecture.metadata.format === formatFilter)
    );

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.metadata.date).getTime() - new Date(b.metadata.date).getTime()
          : new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.metadata[sortBy].localeCompare(b.metadata[sortBy])
          : b.metadata[sortBy].localeCompare(a.metadata[sortBy]);
      }
    });

    setFilteredLectures(filtered);
  };

  const handleSort = (column: keyof Lecture['metadata']) => {
    setSortBy(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await axios.delete(`http://localhost:3000/api/lectures/${id}`);
        fetchLectures(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting lecture:', error);
      }
    }
  };

  const uniqueCourses = Array.from(new Set(lectures.map(lecture => lecture.metadata.course)));
  const uniqueFormats = Array.from(new Set(lectures.map(lecture => lecture.metadata.format)));

  return (
    <Container>
      <h1 className="mb-4">Lectures</h1>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">All Courses</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
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
      <Table striped bordered hover>
        <thead>
          <tr>
            {['title', 'course', 'date', 'format'].map((column) => (
              <th key={column} onClick={() => handleSort(column as keyof Lecture['metadata'])}>
                <div className="d-flex justify-content-between align-items-center">
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                  {sortBy === column && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
                </div>
              </th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLectures.map((lecture) => (
            <tr key={lecture._id}>
              <td>{lecture.metadata.title}</td>
              <td>{lecture.metadata.course}</td>
              <td>{new Date(lecture.metadata.date).toLocaleDateString()}</td>
              <td>{lecture.metadata.format}</td>
              <td>
                <Button as={Link as any} to={`/lecture/${lecture._id}`} variant="outline-primary" size="sm" className="me-2">
                  View
                </Button>
                <Button onClick={() => handleDelete(lecture._id)} variant="outline-danger" size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default LectureList;