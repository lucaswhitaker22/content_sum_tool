import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { Course } from '../../../interfaces/Course.interface';
import { fetchCourses, deleteCourse } from '../../../utils/api';
import FilterBar from './Components/FilterBar';
import CourseTable from './Components/CourseTable';
import CourseDetailsModal from './Components/CourseDetailsModal';

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
    fetchCourseData();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, departmentFilter, termFilter, yearFilter, sortBy, sortOrder]);

  const fetchCourseData = async () => {
    try {
      const response = await fetchCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again.');
    }
  };

  const filterAndSortCourses = () => {
    let filtered = courses.filter(course =>
      (departmentFilter === '' || course.department.toLowerCase().includes(departmentFilter.toLowerCase())) &&
      (termFilter === '' || course.term.toLowerCase() === termFilter.toLowerCase()) &&
      (yearFilter === '' || course.year.toString() === yearFilter)
    );

    const uniqueFilteredCourses = Array.from(
      new Map(filtered.map(course => [course._id, course])).values()
    );

    uniqueFilteredCourses.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCourses(uniqueFilteredCourses);
  };

  const handleSort = (column: keyof Course) => {
    setSortBy(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);
      fetchCourseData();
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course. Please try again.');
    }
  };

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  return (
    <Container className="mt-4">
      <h1>Course List</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <FilterBar
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        termFilter={termFilter}
        setTermFilter={setTermFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
      />
      <CourseTable
        courses={filteredCourses}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        handleDelete={handleDelete}
        handleViewDetails={handleViewDetails}
      />
      <CourseDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        course={selectedCourse}
      />
    </Container>
  );
};

export default CourseList;