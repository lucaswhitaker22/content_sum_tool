import React from 'react';
import { Button, Collapse, Dropdown, Card, Form, Row, Col } from 'react-bootstrap';
import { presetConfigurations } from './ConfigurationPresets';

interface ConfigurationSectionProps {
    config: {
      metadata_key_topics: number[];
      notes_word_count_range: number[];
      review_question_count: number[];
      practice_multiple_choice_count: number;
      practice_short_answer_count: number[];
      practice_long_answer_count: number[];
    };
    handleConfigChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showConfig: boolean;
    setShowConfig: React.Dispatch<React.SetStateAction<boolean>>;
    setConfig: React.Dispatch<React.SetStateAction<ConfigurationSectionProps['config']>>;
}

const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({
    config,
    handleConfigChange,
    showConfig,
    setShowConfig,
    setConfig
  }) => {
  const handlePresetChange = (eventKey: string | null, event: React.SyntheticEvent<unknown>) => {
    if (eventKey) {
      setConfig(presetConfigurations[eventKey as keyof typeof presetConfigurations]);
    }
  };
  
  return (
    <div className="mt-4">
      <Button
        variant="secondary"
        onClick={() => setShowConfig(!showConfig)}
        aria-controls="config-collapse"
        aria-expanded={showConfig}
      >
        {showConfig ? 'Hide Configuration' : 'Show Configuration'}
      </Button>

      <Collapse in={showConfig}>
        <div id="config-collapse">
          <Card className="mt-3">
            <Card.Body>
              <h3>Configuration (Optional)</h3>
              
              <Form.Group className="mb-3">
                <Form.Label>Preset Configurations</Form.Label>
                <Dropdown onSelect={handlePresetChange}>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Select Preset
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="default">Default</Dropdown.Item>
                    <Dropdown.Item eventKey="minimal">Minimal</Dropdown.Item>
                    <Dropdown.Item eventKey="comprehensive">Comprehensive</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Metadata Key Topics</Form.Label>
                    <Form.Control
                      type="text"
                      name="metadata_key_topics"
                      value={config.metadata_key_topics.join(',')}
                      onChange={handleConfigChange}
                      placeholder="e.g., 5,7"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Notes Word Count Range</Form.Label>
                    <Form.Control
                      type="text"
                      name="notes_word_count_range"
                      value={config.notes_word_count_range.join(',')}
                      onChange={handleConfigChange}
                      placeholder="e.g., 1000,2000"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Review Question Count</Form.Label>
                    <Form.Control
                      type="text"
                      name="review_question_count"
                      value={config.review_question_count.join(',')}
                      onChange={handleConfigChange}
                      placeholder="e.g., 5,7"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Practice Multiple Choice Count</Form.Label>
                    <Form.Control
                      type="number"
                      name="practice_multiple_choice_count"
                      value={config.practice_multiple_choice_count}
                      onChange={handleConfigChange}
                      placeholder="e.g., 5"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Practice Short Answer Count</Form.Label>
                    <Form.Control
                      type="text"
                      name="practice_short_answer_count"
                      value={config.practice_short_answer_count.join(',')}
                      onChange={handleConfigChange}
                      placeholder="e.g., 2,3"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Practice Long Answer Count</Form.Label>
                    <Form.Control
                      type="text"
                      name="practice_long_answer_count"
                      value={config.practice_long_answer_count.join(',')}
                      onChange={handleConfigChange}
                      placeholder="e.g., 1,2"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </Collapse>
    </div>
  );
};

export default ConfigurationSection;