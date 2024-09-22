import React from 'react';
import { Stack, Text, Card } from '@mantine/core';

interface ReviewItem {
  question: string;
  answer: string;
}

interface ReviewSectionProps {
  review: ReviewItem[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ review }) => {
  return (
    <Stack gap="md">
      {review.map((item, index) => (
        <Card key={index} shadow="sm" padding="lg">
          <Text fw={700}>Q: {item.question}</Text>
          <Text>A: {item.answer}</Text>
        </Card>
      ))}
    </Stack>
  );
};

export default ReviewSection;