import React from 'react';
import { List } from '@mantine/core';

interface TopicsListProps {
  topics: string[];
}

const TopicsList: React.FC<TopicsListProps> = ({ topics }) => {
  return (
    <List>
      {topics.map((topic, index) => (
        <List.Item key={index}>{topic}</List.Item>
      ))}
    </List>
  );
};

export default TopicsList;