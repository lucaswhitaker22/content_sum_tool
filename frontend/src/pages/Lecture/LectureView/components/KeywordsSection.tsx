import React from 'react';
import { Table } from '@mantine/core';

interface Keyword {
  term: string;
  definition: string;
}

interface KeywordsSectionProps {
  keywords: Keyword[];
}

const KeywordsSection: React.FC<KeywordsSectionProps> = ({ keywords }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Term</th>
          <th>Definition</th>
        </tr>
      </thead>
      <tbody>
        {keywords.map((keyword, index) => (
          <tr key={index}>
            <td>{keyword.term}</td>
            <td>{keyword.definition}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default KeywordsSection;