import React, { useState } from 'react';
import { Paper, Title, Collapse, Button } from '@mantine/core';

interface ExpandableSectionProps {
  title: string;
  content: React.ReactNode;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Paper shadow="xs" p="md">
      <Title order={2}>{title}</Title>
      <Collapse in={isExpanded}>
        {content}
      </Collapse>
      <Button onClick={() => setIsExpanded(!isExpanded)} variant="subtle" fullWidth mt="sm">
        {isExpanded ? 'Collapse' : 'Expand'}
      </Button>
    </Paper>
  );
};

export default ExpandableSection;