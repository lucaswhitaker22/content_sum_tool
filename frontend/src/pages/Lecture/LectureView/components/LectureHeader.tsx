import React from 'react';
import { Title, Text, Group } from '@mantine/core';

interface LectureHeaderProps {
  lecture: {
    metadata: {
      title: string;
      date: string;
      format: string;
    };
  };
}

const LectureHeader: React.FC<LectureHeaderProps> = ({ lecture }) => {
  return (
    <>
      <Title order={1}>{lecture.metadata.title}</Title>
      <Group justify="space-between">
        <Text>Date: {new Date(lecture.metadata.date).toLocaleDateString()}</Text>
        <Text>Format: {lecture.metadata.format}</Text>
      </Group>
    </>
  );
};

export default LectureHeader;