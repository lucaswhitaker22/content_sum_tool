import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Loader, Stack } from '@mantine/core';
import LectureHeader from './components/LectureHeader';
import ExpandableSection from './components/ExpandableSection';
import TopicsList from './components/TopicsList';
import ReviewSection from './components/ReviewSection';
import KeywordsSection from './components/KeywordsSection';
import NotesSection from './components/NoteSection';
import PracticeSection from './components/PracticeSection';

interface Lecture {
  metadata: {
    title: string;
    date: string;
    format: string;
    overview: string;
    topics: string[];
  };
  notes: string;
  review: Array<{
    question: string;
    answer: string;
  }>;
  keywords: Array<{ term: string; definition: string }>;
  practice?: Array<{
    question: string;
    answer: string;
    explanation: string;
  }>;
}

const LectureView: React.FC = () => {
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const response = await axios.get<Lecture>(`http://localhost:3000/api/lectures/${id}`);
        setLecture(response.data);
      } catch (error) {
        console.error('Error fetching lecture:', error);
      }
    };

    fetchLecture();
  }, [id]);

  if (!lecture) {
    return (
      <Container size="md" py="xl">
        <Loader size="xl" variant="dots" />
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <LectureHeader lecture={lecture} />
        <ExpandableSection title="Overview" content={<p>{lecture.metadata.overview}</p>} />
        <ExpandableSection title="Topics" content={<TopicsList topics={lecture.metadata.topics} />} />
        <ExpandableSection title="Notes" content={<NotesSection notes={lecture.notes} />} />
        <ExpandableSection title="Review" content={<ReviewSection review={lecture.review} />} />
        <ExpandableSection title="Keywords" content={<KeywordsSection keywords={lecture.keywords} />} />
        {lecture.practice && (
          <ExpandableSection title="Practice" content={<PracticeSection practice={lecture.practice} />} />
        )}
      </Stack>
    </Container>
  );
};

export default LectureView;