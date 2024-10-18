import React from 'react';
import { Button, Collapse, Dropdown, Card, Form, Row, Col } from 'react-bootstrap';
import { presetConfigurations } from './ConfigurationPresets';

interface ConfigurationSectionProps {
    config: {
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
  } else {
    // If no preset is selected, assign default values
    setConfig({
      metadata_overview_sentences: [2, 3],
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
      keywords_term_count: [5, 10],
      keywords_definition_sentences: [1, 2]
    });
  }
};

type ConfigKey = keyof ConfigurationSectionProps['config'];

function isConfigKey(key: string): key is ConfigKey {
  return key in config;
}

const updateRangeConfig = (name: string, index: number, value: string) => {
  if (isConfigKey(name) && Array.isArray(config[name])) {
    const updatedRange = [...config[name] as number[]];
    updatedRange[index] = parseInt(value, 10) || 0;
    setConfig(prevConfig => ({ ...prevConfig, [name]: updatedRange }));
  }
};

const updateSingleConfig = (name: string, value: string) => {
  if (isConfigKey(name) && typeof config[name] === 'number') {
    setConfig(prevConfig => ({ ...prevConfig, [name]: parseInt(value, 10) || 0 }));
  }
};

return (
  <div className="mt-4">
    <Button
      variant="primary"
      onClick={() => setShowConfig(!showConfig)}
      aria-controls="config-collapse"
      aria-expanded={showConfig}
      className="mb-3"
    >
      {showConfig ? 'Hide Configuration' : 'Show Configuration'}
    </Button>

    <Collapse in={showConfig}>
      <div id="config-collapse">
        <Card className="shadow-sm">
          <Card.Header className="bg-light">
            <h4 className="mb-0">Configuration Settings</h4>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-4">
                <Form.Label><strong>Preset Configurations</strong></Form.Label>
                <Dropdown onSelect={handlePresetChange}>
                  <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" className="w-100">
                    Select Preset
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    <Dropdown.Item eventKey="default">Default</Dropdown.Item>
                    <Dropdown.Item eventKey="minimal">Minimal</Dropdown.Item>
                    <Dropdown.Item eventKey="comprehensive">Comprehensive</Dropdown.Item>
                    <Dropdown.Item eventKey="extensive">Extensive</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <Row>
                <Col >
  {/* Metadata Key Topics */}
  <Form.Group className="mb-3">
                  <Form.Label><strong>Metadata Key Topics</strong></Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        value={config.metadata_key_topics[0]}
                        onChange={e => updateRangeConfig('metadata_key_topics', 0, e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        value={config.metadata_key_topics[1]}
                        onChange={e => updateRangeConfig('metadata_key_topics', 1, e.target.value)}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                {/* Notes Word Count Range */}
                <Form.Group className="mb-3">
                  <Form.Label><strong>Notes Word Count Range</strong></Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        value={config.notes_word_count_range[0]}
                        onChange={e => updateRangeConfig('notes_word_count_range', 0, e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        value={config.notes_word_count_range[1]}
                        onChange={e => updateRangeConfig('notes_word_count_range', 1, e.target.value)}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                {/* Review Question Count */}
                <Form.Group className="mb-3">
                  <Form.Label><strong>Review Question Count</strong></Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        value={config.review_question_count[0]}
                        onChange={e => updateRangeConfig('review_question_count', 0, e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        value={config.review_question_count[1]}
                        onChange={e => updateRangeConfig('review_question_count', 1, e.target.value)}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                {/* Practice Multiple Choice Count */}
                <Form.Group className="mb-3">
                  <Form.Label><strong>Practice Multiple Choice Count</strong></Form.Label>
                  <Form.Control
                    type="number"
                    value={config.practice_multiple_choice_count}
                    onChange={e => updateSingleConfig('practice_multiple_choice_count', e.target.value)}
                  />
                </Form.Group>

                {/* Practice Short Answer Count */}
                <Form.Group className="mb-3">
                  <Form.Label><strong>Practice Short Answer Count</strong></Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        value={config.practice_short_answer_count[0]}
                        onChange={e => updateRangeConfig('practice_short_answer_count', 0, e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        value={config.practice_short_answer_count[1]}
                        onChange={e => updateRangeConfig('practice_short_answer_count', 1, e.target.value)}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                {/* Practice Long Answer Count */}
                <Form.Group className="mb-3">
                  <Form.Label><strong>Practice Long Answer Count</strong></Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        value={config.practice_long_answer_count[0]}
                        onChange={e => updateRangeConfig('practice_long_answer_count', 0, e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        value={config.practice_long_answer_count[1]}
                        onChange={e => updateRangeConfig('practice_long_answer_count', 1, e.target.value)}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                {/* Keywords Term Count */}
                <Form.Group className="mb-3">
                  <Form.Label><strong>Keywords Term Count</strong></Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        value={config.keywords_term_count[0]}
                        onChange={e => updateRangeConfig('keywords_term_count', 0, e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        value={config.keywords_term_count[1]}
                        onChange={e => updateRangeConfig('keywords_term_count', 1, e.target.value)}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Collapse>
  </div>
);
};

export default ConfigurationSection;