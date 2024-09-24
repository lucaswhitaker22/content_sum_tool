import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Accordion, Button, Card, ListGroup, Row, Col, Badge, Table, Alert, Spinner } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { Calendar3, Link, ChevronDown, Search, ChevronUp, Book, ListUl } from 'react-bootstrap-icons';
import Lecture from './Lecture.interface'
import './LectureNotes.css'; // Import your custom CSS file
import remarkGfm from 'remark-gfm';


const LectureNotes: React.FC<{ notes: string }> = ({ notes }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header as="h5" className="bg-secondary text-white">
        Lecture Notes
        <Button variant="link" className="text-white float-end" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </Card.Header>
      {isExpanded && (
        <Card.Body>
          <ReactMarkdown 
            className="markdown-content" 
            remarkPlugins={[remarkGfm]}
          >
            {notes}
          </ReactMarkdown>
        </Card.Body>
      )}
    </Card>
  );
};

const LectureHeader: React.FC<{ metadata: Lecture['metadata'] }> = ({ metadata }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header as="h5" className="bg-primary text-white d-flex justify-content-between align-items-center">
        Lecture Information
        <div>
          <a href={metadata.path} target="_blank" rel="noopener noreferrer" className="text-white me-2">
            <Link size={18} />
          </a>
          <Button variant="link" className="text-white p-0" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </Card.Header>
      {isExpanded && (
        <Card.Body>
          <Card.Title as="h2" className="mb-3">{metadata.title}</Card.Title>
          <Row className="mb-3">
            <Col sm={4}>
              <Card.Subtitle className="text-muted">
                <Book className="me-2" />
                {metadata.course}
              </Card.Subtitle>
            </Col>
            <Col sm={4}>
              <Card.Subtitle className="text-muted">
                <Calendar3 className="me-2" />
                {new Date(metadata.date).toLocaleDateString()}
              </Card.Subtitle>
            </Col>
            <Col sm={4}>
              <Badge bg="primary">{metadata.format}</Badge>
            </Col>
          </Row>
          <Card.Text>{metadata.overview}</Card.Text>
          <Card.Text as="div">
            <h5 className="mb-3">
              <ListUl className="me-2" />
              Topics:
            </h5>
            <Row xs={2} md={3} lg={4} className="g-2">
              {metadata.topics.map((topic, index) => (
                <Col key={index}>
                  <Badge bg="light" text="dark" className="w-100 text-wrap py-2">
                    {topic}
                  </Badge>
                </Col>
              ))}
            </Row>
          </Card.Text>
        </Card.Body>
      )}
    </Card>
  );
};

  const LectureReview: React.FC<{ review: Lecture['review'] }> = ({ review }) => {
    const [isSectionExpanded, setIsSectionExpanded] = useState(false);
    const [activeKeys, setActiveKeys] = useState<string[]>([]);
  
    const toggleAnswer = (eventKey: string) => {
      setActiveKeys(prevKeys =>
        prevKeys.includes(eventKey)
          ? prevKeys.filter(key => key !== eventKey)
          : [...prevKeys, eventKey]
      );
    };
  
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Header as="h5" className="bg-secondary text-white">
          Review Questions
          <Button variant="link" className="text-white float-end" onClick={() => setIsSectionExpanded(!isSectionExpanded)}>
            {isSectionExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </Card.Header>
        {isSectionExpanded && (
          <Card.Body>
            <Accordion activeKey={activeKeys}>
              {review.map((item, index) => {
                const eventKey = index.toString();
                const isActive = activeKeys.includes(eventKey);
  
                return (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <Card.Title as="h6">Q: {item.question}</Card.Title>
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={() => toggleAnswer(eventKey)}
                        className="mb-2"
                      >
                        {isActive ? <><ChevronUp /> Hide Answer</> : <><ChevronDown /> Show Answer</>}
                      </Button>
                      <Accordion.Collapse eventKey={eventKey}>
                        <Card.Text>A: {item.answer}</Card.Text>
                      </Accordion.Collapse>
                    </Card.Body>
                  </Card>
                );
              })}
            </Accordion>
          </Card.Body>
        )}
      </Card>
    );
  };
  
  
  const LectureKeywords: React.FC<{ keywords: Lecture['keywords'] }> = ({ keywords }) => {
    const [isSectionExpanded, setIsSectionExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
  
    const filteredKeywords = keywords.filter(keyword =>
      keyword.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keyword.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Header as="h5" className="bg-secondary text-white">
          Keywords
          <Button variant="link" className="text-white float-end" onClick={() => setIsSectionExpanded(!isSectionExpanded)}>
            {isSectionExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </Card.Header>
        {isSectionExpanded && (
          <Card.Body>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <Search />
              </span>
              <input
                type="text"
                placeholder="Search keywords..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Definition</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords.map((keyword, index) => (
                  <tr key={index}>
                    <td><strong>{keyword.term}</strong></td>
                    <td>{keyword.definition}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        )}
      </Card>
    );
  };
  
  const LecturePractice: React.FC<{ practice: Lecture['practice'] }> = ({ practice }) => {
    const [isSectionExpanded, setIsSectionExpanded] = useState(false);
    const [showAnswers, setShowAnswers] = useState<{ [key: string]: boolean }>({});
  
    const toggleAnswer = (questionType: string, index: number) => {
      setShowAnswers(prev => ({
        ...prev,
        [`${questionType}-${index}`]: !prev[`${questionType}-${index}`]
      }));
    };
  
    const renderAnswer = (questionType: string, index: number, content: React.ReactNode) => {
      const isShown = showAnswers[`${questionType}-${index}`];
      return (
        <>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => toggleAnswer(questionType, index)}
            className="mb-2"
          >
            {isShown ? <><ChevronUp /> Hide Answer</> : <><ChevronDown /> Show Answer</>}
          </Button>
          {isShown && content}
        </>
      );
    };
  
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Header as="h5" className="bg-secondary text-white">
          Practice Questions
          <Button variant="link" className="text-white float-end" onClick={() => setIsSectionExpanded(!isSectionExpanded)}>
            {isSectionExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </Card.Header>
        {isSectionExpanded && (
          <Card.Body>
            <Accordion defaultActiveKey="">
              {/* Long Questions */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>Long Questions</Accordion.Header>
                <Accordion.Body>
                  {practice.long.map((item, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <Card.Title as="h6">Q: {item.question}</Card.Title>
                        {renderAnswer('long', index, <p className="mb-0">A: {item.answer}</p>)}
                      </Card.Body>
                    </Card>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
  
              {/* Multiple Choice Questions */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>Multiple Choice Questions</Accordion.Header>
                <Accordion.Body>
                  {practice.multiple.map((item, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <Card.Title as="h6">Q: {item.question}</Card.Title>
                        <ListGroup variant="flush" className="mb-3">
                          {item.options.map((option, optionIndex) => (
                            <ListGroup.Item key={optionIndex}>{option}</ListGroup.Item>
                          ))}
                        </ListGroup>
                        {renderAnswer('multiple', index, (
                          <>
                            <p className="mb-1"><strong>Answer:</strong> {item.answer}</p>
                            <p className="mb-0"><strong>Explanation:</strong> {item.explanation}</p>
                          </>
                        ))}
                      </Card.Body>
                    </Card>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
  
              {/* Short Questions */}
              <Accordion.Item eventKey="2">
                <Accordion.Header>Short Questions</Accordion.Header>
                <Accordion.Body>
                  {practice.short.map((item, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <Card.Title as="h6">Q: {item.question}</Card.Title>
                        {renderAnswer('short', index, <p className="mb-0">A: {item.answer}</p>)}
                      </Card.Body>
                    </Card>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card.Body>
        )}
      </Card>
    );
  };


export { LectureNotes, LectureHeader, LecturePractice, LectureKeywords, LectureReview }