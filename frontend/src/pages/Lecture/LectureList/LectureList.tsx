import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Table, Button, Row, Col } from 'react-bootstrap';
import { ChevronUp, ChevronDown } from 'react-bootstrap-icons';
import { PrintButton } from '../LecturePrint/PrintButton';
import { Lecture } from '../Lecture.interface';
const token = localStorage.getItem('authToken');


axios.defaults.withCredentials = true;

export interface Course {
  _id: string;
  department: string;
  number: string;
  professor: string;
  term: string;
  year: number;
  title: string;
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
      const response = await axios.get<Lecture[]>('http://localhost:3000/api/lectures', {headers: {
        'Authorization': `Bearer ${token}`
      }});
      setLectures(response.data);
      setFilteredLectures(response.data);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const filterAndSortLectures = () => {
    // Create a Map to store unique lectures by their _id
    const uniqueLecturesMap = new Map<string, Lecture>();
  
    lectures.forEach(lecture => {
      if (
        (courseFilter === '' || lecture.metadata.course._id === courseFilter) &&
        (formatFilter === '' || lecture.metadata.format === formatFilter)
      ) {
        // Use the lecture._id as the key to ensure uniqueness
        uniqueLecturesMap.set(lecture._id, lecture);
      }
    });
  
    // Convert the Map values back to an array
    const filtered = Array.from(uniqueLecturesMap.values());
  
    const sortedLectures = filtered.sort((a, b) => {
      const aValue = getSortValue(a, sortBy);
      const bValue = getSortValue(b, sortBy);
      
      return sortOrder === 'asc' 
        ? compareValues(aValue, bValue)
        : compareValues(bValue, aValue);
    });
  
    setFilteredLectures(sortedLectures);
  };
  
  const getSortValue = (lecture: Lecture, sortBy: keyof Lecture['metadata']) => {
    if (sortBy === 'date') {
      return new Date(lecture.metadata.date).getTime();
    }
    if (sortBy === 'course') {
      return `${lecture.metadata.course.department} ${lecture.metadata.course.number}`;
    }
    return lecture.metadata[sortBy];
  };
  
  const compareValues = (a: any, b: any): number => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }
    return a - b;
  };

  const handleSort = (column: keyof Lecture['metadata']) => {
    setSortBy(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await axios.delete(`http://localhost:3000/api/lectures/${id}`,{headers: {
          'Authorization': `Bearer ${token}`
        }});
        fetchLectures(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting lecture:', error);
      }
    }
  };


  const uniqueCourses = Array.from(
    new Map(lectures.map(lecture => [lecture.metadata.course._id, lecture.metadata.course]))
  ).map(([_, course]) => course);
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
              <td>{`${lecture.metadata.course.department} ${lecture.metadata.course.number}: ${lecture.metadata.course.title}`}</td>
              <td>{new Date(lecture.metadata.date).toLocaleDateString()}</td>
              <td>{lecture.metadata.format}</td>
              <td>
                <Button as={Link as any} to={`/lecture/${lecture._id}`} variant="outline-primary" size="sm" className="me-2">
                  View
                </Button>
                <Button onClick={() => handleDelete(lecture._id)} variant="outline-danger" size="sm" className="me-2">
                  Delete
                </Button>
                <Button
                  as={Link as any}
                  to={`/lecture/edit/${lecture._id}`}
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                >
                  Edit
                </Button>
                <PrintButton lecture={lecture} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

                  
export default LectureList;