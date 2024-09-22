import React from 'react';
import { Stack, Text, Card, Accordion } from '@mantine/core';

interface PracticeItem {
  question: string;
  answer: string;
  explanation: string;
}

interface PracticeSectionProps {
  practice: PracticeItem[];
}

const PracticeSection: React.FC<PracticeSectionProps> = ({ practice }) => {
  return (
    <Stack gap="md">
      {practice.map((item, index) => (
        <Card key={index} shadow="sm" padding="lg">
          <Text fw={700}>Q: {item.question}</Text>
          <Accordion>
            <Accordion.Item value="answer">
              <Accordion.Control>Show Answer</Accordion.Control>
              <Accordion.Panel>
                <Text>A: {item.answer}</Text>
                <Text fw={700} mt="md">Correct Answer:</Text>
                <Text>{item.answer}</Text>
                <Text fw={700} mt="md">Explanation:</Text>
                <Text>{item.explanation}</Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Card>
      ))}
    </Stack>
  );
};

export default PracticeSection;