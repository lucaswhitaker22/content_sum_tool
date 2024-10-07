import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Course } from '../../Course.interface';

interface CourseTableProps {
  courses: Course[];
  sortBy: keyof Course;
  sortOrder: 'asc' | 'desc';
  handleSort: (column: keyof Course) => void;
  handleDelete: (id: string) => void;
  handleViewDetails: (course: Course) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  sortBy,
  sortOrder,
  handleSort,
  handleDelete,
  handleViewDetails,
}) => {
  return (
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
        {courses.map((course) => (
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
                to={`/course/edit/${course._id}`}
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
  );
};

export default CourseTable;