import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Course } from './Course.interface'


const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [termFilter, setTermFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState<keyof Course>('department');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, departmentFilter, termFilter, yearFilter, sortBy, sortOrder]);

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };
  
  const fetchCourses = async () => {
    try {
      const response = await axios.get<Course[]>('http://localhost:3000/api/courses', { withCredentials: true });
      setCourses(response.data);
    } catch (error) {
      setError('Failed to fetch courses. Please try again later.');
    }
  };

  const filterAndSortCourses = () => {
    let filtered = courses.filter(course =>
      (departmentFilter === '' || course.department.toLowerCase().includes(departmentFilter.toLowerCase())) &&
      (termFilter === '' || course.term.toLowerCase() === termFilter.toLowerCase()) &&
      (yearFilter === '' || course.year.toString() === yearFilter)
    );
  
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue != null && bValue != null) {
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  
    setFilteredCourses(filtered);
  };

  const handleSort = (column: keyof Course) => {
    setSortBy(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:3000/api/courses/${id}`, { withCredentials: true });
        fetchCourses();
      } catch (error) {
        setError('Failed to delete course. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h1>Course List</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Filter by Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Filter by Term"
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Filter by Year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button as={Link as any} to="/courses/add" variant="primary">Add New Course</Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            {['department', 'number', 'title', 'professor', 'term', 'year'].map((column) => (
              <th key={column} onClick={() => handleSort(column as keyof Course)}>
                {column.charAt(0).toUpperCase() + column.slice(1)}
                {sortBy === column && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course) => (
            <tr key={course._id}>
              <td>{course.department}</td>
              <td>{course.number}</td>
              <td>{course.title}</td>
              <td>{course.professor}</td>
              <td>{course.term}</td>
              <td>{course.year}</td>
              <td>
              <Button
                  onClick={() => handleViewDetails(course)}
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                >
                  View Details
                </Button>
                <Button
                  as={Link as any}
                  to={`/courses/edit/${course._id}`}
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                >
                  Edit
                </Button>
                <Button onClick={() => handleDelete(course._id)} variant="outline-danger" size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCourse?.department} {selectedCourse?.number}: {selectedCourse?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Professor:</strong> {selectedCourse?.professor}</p>
          <p><strong>Term:</strong> {selectedCourse?.term} {selectedCourse?.year}</p>
          
          {selectedCourse?.outlineUrl && (
            <p>
              <strong>Course Outline:</strong>{' '}
              <a href={selectedCourse.outlineUrl} target="_blank" rel="noopener noreferrer">
                View Outline
              </a>
            </p>
          )}

          {selectedCourse?.gradingScheme && selectedCourse.gradingScheme.length > 0 && (
            <>
              <h5>Grading Scheme:</h5>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCourse.gradingScheme.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item}</td>
                      <td>{item.weight}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CourseList;