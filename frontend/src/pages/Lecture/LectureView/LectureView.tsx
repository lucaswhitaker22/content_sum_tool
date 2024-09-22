import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, ListGroup, Table, Alert, Spinner } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

interface Lecture {
  metadata: {
    overview: string;
    topics: string[];
    format: string;
    date: string;
    course: string;
    title: string;
    path: string;
  };
  notes: string;
  review: Array<{ question: string; answer: string }>;
  keywords: Array<{ term: string; definition: string }>;
  practice: {
    long: Array<{ question: string; answer: string }>;
    multiple: Array<{
      question: string;
      options: string[];
      answer: string;
      explanation: string;
    }>;
    short: Array<{ question: string; answer: string }>;
  };
}

const LectureView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const response = await axios.get<Lecture>(`http://localhost:3000/api/lectures/${id}`);
        setLecture(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch lecture data');
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!lecture) {
    return (
      <Container>
        <Alert variant="warning">Lecture not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <LectureHeader metadata={lecture.metadata} />
      <LectureNotes notes={lecture.notes} />
      <LectureReview review={lecture.review} />
      <LectureKeywords keywords={lecture.keywords} />
      <LecturePractice practice={lecture.practice} />
    </Container>
  );
};

const LectureHeader: React.FC<{ metadata: Lecture['metadata'] }> = ({ metadata }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{metadata.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{metadata.course}</Card.Subtitle>
        <Card.Text>
          <strong>Date:</strong> {new Date(metadata.date).toLocaleDateString()}
          <br />
          <strong>Format:</strong> {metadata.format}
        </Card.Text>
        <Card.Text>{metadata.overview}</Card.Text>
        <h5>Topics:</h5>
        <ListGroup>
          {metadata.topics.map((topic, index) => (
            <ListGroup.Item key={index}>{topic}</ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};


const LectureNotes: React.FC<{ notes: string }> = ({ notes }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Lecture Notes</Card.Title>
        <ReactMarkdown>{notes}</ReactMarkdown>
      </Card.Body>
    </Card>
  );
};

const LectureReview: React.FC<{ review: Lecture['review'] }> = ({ review }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Review Questions</Card.Title>
        {review.map((item, index) => (
          <div key={index} className="mb-3">
            <h6>Q: {item.question}</h6>
            <p>A: {item.answer}</p>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

const LectureKeywords: React.FC<{ keywords: Lecture['keywords'] }> = ({ keywords }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Keywords</Card.Title>
        <Table striped bordered hover>
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
      </Card.Body>
    </Card>
  );
};

const LecturePractice: React.FC<{ practice: Lecture['practice'] }> = ({ practice }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Practice Questions</Card.Title>
        
        <h5>Long Questions</h5>
        {practice.long.map((item, index) => (
          <div key={index} className="mb-3">
            <h6>Q: {item.question}</h6>
            <p>A: {item.answer}</p>
          </div>
        ))}

        <h5>Multiple Choice Questions</h5>
        {practice.multiple.map((item, index) => (
          <div key={index} className="mb-3">
            <h6>Q: {item.question}</h6>
            <ListGroup>
              {item.options.map((option, optionIndex) => (
                <ListGroup.Item key={optionIndex}>{option}</ListGroup.Item>
              ))}
            </ListGroup>
            <p><strong>Answer:</strong> {item.answer}</p>
            <p><strong>Explanation:</strong> {item.explanation}</p>
          </div>
        ))}

        <h5>Short Questions</h5>
        {practice.short.map((item, index) => (
          <div key={index} className="mb-3">
            <h6>Q: {item.question}</h6>
            <p>A: {item.answer}</p>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default LectureView;