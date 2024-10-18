import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { fetchLectures } from '../../../utils/api';
import { Lecture } from '../../../interfaces/Lecture.interface';
import LectureFilters from './LectureFilters';
import LectureTable from './LectureTable';

const LectureList: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([]);
  const [courseFilter, setCourseFilter] = useState<string>('');
  const [formatFilter, setFormatFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Lecture['metadata']>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchLecturesData();
  }, []);

  useEffect(() => {
    filterAndSortLectures();
  }, [courseFilter, formatFilter, sortBy, sortOrder, lectures]);

  const fetchLecturesData = async () => {
    try {
      const response = await fetchLectures();
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

  return (
    <Container>
      <h1 className="mb-4">Lectures</h1>
      <LectureFilters
        lectures={lectures}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        formatFilter={formatFilter}
        setFormatFilter={setFormatFilter}
      />
      <LectureTable
        lectures={filteredLectures}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort as any}
        onDelete={fetchLecturesData}
      />
    </Container>
  );
};

export default LectureList;