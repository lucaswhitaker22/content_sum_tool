import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, InputGroup} from 'react-bootstrap';

export type ConfigType = {
  metadata_overview_sentences: number[];
  metadata_key_topics: number[];
  metadata_topic_description_sentences: number[];
  notes_word_count_range: number[];
  review_question_count: number[];
  review_answer_explanation_sentences: number[];
  practice_multiple_choice_count: number;
  practice_multiple_choice_options: number;
  practice_short_answer_count: number[];
  practice_long_answer_count: number[];
  practice_answer_explanation_sentences: number[];
  keywords_term_count: number[];
  keywords_definition_sentences: number[];
};

interface ConfigurationFormProps {
  config: ConfigType;
  handleConfigChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field?: keyof ConfigType,
    index?: number
  ) => void;
}
const presetConfigurations: { [key: string]: ConfigType } = {
  default: {
    metadata_overview_sentences: [4, 6],
    metadata_key_topics: [5, 7],
    metadata_topic_description_sentences: [1, 2],
    notes_word_count_range: [1000, 2000],
    review_question_count: [5, 7],
    review_answer_explanation_sentences: [1, 2],
    practice_multiple_choice_count: 5,
    practice_multiple_choice_options: 4,
    practice_short_answer_count: [2, 3],
    practice_long_answer_count: [1, 2],
    practice_answer_explanation_sentences: [1, 2],
    keywords_term_count: [10, 15],
    keywords_definition_sentences: [1, 2],
  },
  compact: {
    metadata_overview_sentences: [2, 3],
    metadata_key_topics: [3, 5],
    metadata_topic_description_sentences: [1, 1],
    notes_word_count_range: [500, 1000],
    review_question_count: [3, 5],
    review_answer_explanation_sentences: [1, 1],
    practice_multiple_choice_count: 3,
    practice_multiple_choice_options: 3,
    practice_short_answer_count: [1, 2],
    practice_long_answer_count: [0, 1],
    practice_answer_explanation_sentences: [1, 1],
    keywords_term_count: [5, 10],
    keywords_definition_sentences: [1, 1],
  },
  extensive: {
    metadata_overview_sentences: [6, 8],
    metadata_key_topics: [7, 10],
    metadata_topic_description_sentences: [2, 3],
    notes_word_count_range: [2000, 3000],
    review_question_count: [8, 10],
    review_answer_explanation_sentences: [2, 3],
    practice_multiple_choice_count: 7,
    practice_multiple_choice_options: 5,
    practice_short_answer_count: [3, 4],
    practice_long_answer_count: [2, 3],
    practice_answer_explanation_sentences: [2, 3],
    keywords_term_count: [15, 20],
    keywords_definition_sentences: [2, 3],
  },
};

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ config, handleConfigChange }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('default');

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const presetConfig = presetConfigurations[preset];
    Object.entries(presetConfig).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v, index) => {
          const fakeEvent = {
            target: { name: key, value: v.toString() }
          } as React.ChangeEvent<HTMLInputElement>;
          handleConfigChange(fakeEvent, key as keyof ConfigType, index);
        });
      } else {
        const fakeEvent = {
          target: { name: key, value: value.toString() }
        } as React.ChangeEvent<HTMLInputElement>;
        handleConfigChange(fakeEvent);
      }
    });
  };
  return (
<Card className="mt-3">
  <Card.Body>
    <h3>Configuration (Optional)</h3>

    <Form>
      <h6>Preset Configuration</h6>
      <Form.Group className="mb-3">
        <Form.Select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="compact">Compact</option>
          <option value="extensive">Extensive</option>
        </Form.Select>
      </Form.Group>

      <h6>Metadata Settings</h6>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Overview Sentences</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="metadata_overview_sentences_min"
                value={config.metadata_overview_sentences[0]}
                onChange={(e) => handleConfigChange(e, 'metadata_overview_sentences', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="metadata_overview_sentences_max"
                value={config.metadata_overview_sentences[1]}
                onChange={(e) => handleConfigChange(e, 'metadata_overview_sentences', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Key Topic Count</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="metadata_key_topics_min"
                value={config.metadata_key_topics[0]}
                onChange={(e) => handleConfigChange(e, 'metadata_key_topics', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="metadata_key_topics_max"
                value={config.metadata_key_topics[1]}
                onChange={(e) => handleConfigChange(e, 'metadata_key_topics', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Topic Description Sentences</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="metadata_topic_description_sentences_min"
                value={config.metadata_topic_description_sentences[0]}
                onChange={(e) => handleConfigChange(e, 'metadata_topic_description_sentences', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="metadata_topic_description_sentences_max"
                value={config.metadata_topic_description_sentences[1]}
                onChange={(e) => handleConfigChange(e, 'metadata_topic_description_sentences', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Notes Word Count</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="notes_word_count_range_min"
                value={config.notes_word_count_range[0]}
                onChange={(e) => handleConfigChange(e, 'notes_word_count_range', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="notes_word_count_range_max"
                value={config.notes_word_count_range[1]}
                onChange={(e) => handleConfigChange(e, 'notes_word_count_range', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <h6>Review Settings</h6>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Question Count</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="review_question_count_min"
                value={config.review_question_count[0]}
                onChange={(e) => handleConfigChange(e, 'review_question_count', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="review_question_count_max"
                value={config.review_question_count[1]}
                onChange={(e) => handleConfigChange(e, 'review_question_count', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>Answer Explanation Sentences</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="review_answer_explanation_sentences_min"
                value={config.review_answer_explanation_sentences[0]}
                onChange={(e) => handleConfigChange(e, 'review_answer_explanation_sentences', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="review_answer_explanation_sentences_max"
                value={config.review_answer_explanation_sentences[1]}
                onChange={(e) => handleConfigChange(e, 'review_answer_explanation_sentences', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <h6>Practice Settings</h6>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Multiple Choice Count</Form.Label>
            <Form.Control
              type="number"
              name="practice_multiple_choice_count"
              value={config.practice_multiple_choice_count}
              onChange={(e) => handleConfigChange(e)}
              placeholder="e.g., 5"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Multiple Choice Options</Form.Label>
            <Form.Control
              type="number"
              name="practice_multiple_choice_options"
              value={config.practice_multiple_choice_options}
              onChange={(e) => handleConfigChange(e)}
              placeholder="e.g., 4"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Short Answer Count</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="practice_short_answer_count_min"
                value={config.practice_short_answer_count[0]}
                onChange={(e) => handleConfigChange(e, 'practice_short_answer_count', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="practice_short_answer_count_max"
                value={config.practice_short_answer_count[1]}
                onChange={(e) => handleConfigChange(e, 'practice_short_answer_count', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Long Answer Count</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="practice_long_answer_count_min"
                value={config.practice_long_answer_count[0]}
                onChange={(e) => handleConfigChange(e, 'practice_long_answer_count', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="practice_long_answer_count_max"
                value={config.practice_long_answer_count[1]}
                onChange={(e) => handleConfigChange(e, 'practice_long_answer_count', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Answer Explanation Sentences</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="practice_answer_explanation_sentences_min"
                value={config.practice_answer_explanation_sentences[0]}
                onChange={(e) => handleConfigChange(e, 'practice_answer_explanation_sentences', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="practice_answer_explanation_sentences_max"
                value={config.practice_answer_explanation_sentences[1]}
                onChange={(e) => handleConfigChange(e, 'practice_answer_explanation_sentences', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <h6>Keywords Settings</h6>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Term Count</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="keywords_term_count_min"
                value={config.keywords_term_count[0]}
                onChange={(e) => handleConfigChange(e, 'keywords_term_count', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="keywords_term_count_max"
                value={config.keywords_term_count[1]}
                onChange={(e) => handleConfigChange(e, 'keywords_term_count', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Definition Sentences</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="keywords_definition_sentences_min"
                value={config.keywords_definition_sentences[0]}
                onChange={(e) => handleConfigChange(e, 'keywords_definition_sentences', 0)}
                placeholder="Min"
              />
              <Form.Control
                type="number"
                name="keywords_definition_sentences_max"
                value={config.keywords_definition_sentences[1]}
                onChange={(e) => handleConfigChange(e, 'keywords_definition_sentences', 1)}
                placeholder="Max"
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  </Card.Body>
</Card>
  );
};

export default ConfigurationForm;