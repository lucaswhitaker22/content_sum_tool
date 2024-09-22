import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Text } from '@mantine/core';

interface NotesSectionProps {
  notes: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes }) => {
  return (
    <Text component="div">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
    </Text>
  );
};

export default NotesSection;