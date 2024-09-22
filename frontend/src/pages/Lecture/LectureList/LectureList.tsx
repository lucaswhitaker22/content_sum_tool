import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Title, Select, Table, Group, Button, Text } from '@mantine/core';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

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
  const [courseFilter, setCourseFilter] = useState<string | null>('');
  const [formatFilter, setFormatFilter] = useState<string | null>('');
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
    <Container size="xl">
      <Title order={1} mb="md">Lectures</Title>
      <Group mb="md" gap="md">
        <Select
          value={courseFilter}
          onChange={setCourseFilter}
          placeholder="All Courses"
          data={[{ value: '', label: 'All Courses' }, ...uniqueCourses.map(course => ({ value: course, label: course }))]}
        />
        <Select
          value={formatFilter}
          onChange={setFormatFilter}
          placeholder="All Formats"
          data={[{ value: '', label: 'All Formats' }, ...uniqueFormats.map(format => ({ value: format, label: format }))]}
        />
      </Group>
      <Table>
        <thead>
          <tr>
            {['title', 'course', 'date', 'format'].map((column) => (
              <th key={column} onClick={() => handleSort(column as keyof Lecture['metadata'])}>
                <Group justify="space-between">
                  <Text>{column.charAt(0).toUpperCase() + column.slice(1)}</Text>
                  {sortBy === column && (sortOrder === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />)}
                </Group>
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
                <Group gap="xs">
                  <Button component={Link} to={`/lecture/${lecture._id}`} variant="outline" size="xs">
                    View
                  </Button>
                  <Button onClick={() => handleDelete(lecture._id)} color="red" variant="outline" size="xs">
                    Delete
                  </Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default LectureList;