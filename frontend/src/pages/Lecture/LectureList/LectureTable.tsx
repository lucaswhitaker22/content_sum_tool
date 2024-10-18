import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'react-bootstrap-icons';
import { PrintButton } from '../LecturePrint/PrintButton';
import { Lecture } from '../../../interfaces/Lecture.interface';
import { deleteLecture } from '../../../utils/api';

interface LectureTableProps {
  lectures: Lecture[];
  sortBy: keyof Lecture['metadata'];
  sortOrder: 'asc' | 'desc';
  handleSort: (column: keyof Lecture['metadata']) => void;
  onDelete: () => void;
}

const LectureTable: React.FC<LectureTableProps> = ({
  lectures,
  sortBy,
  sortOrder,
  handleSort,
  onDelete,
}) => {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await deleteLecture(id);
        onDelete(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting lecture:', error);
      }
    }
  };

  return (
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
        {lectures.map((lecture) => (
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
  );
};

export default LectureTable;