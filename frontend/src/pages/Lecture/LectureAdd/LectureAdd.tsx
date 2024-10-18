import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LectureForm from './Components/LectureForm';
import ConfigurationSection from './Components/ConfigurationSection';
import GeneratedDataSection from './Components/GeneratedDataSection';
import { LectureMetadata } from '../../../interfaces/Lecture.interface';
import {
  fetchCourses,
  generateLecture,
  saveLecture,
  uploadPdfFile
} from '../../../utils/api'
interface Course {
  _id: string;
  department: string;
  number: string;
  title: string;
}


interface Lecture {
  _id?: string;
  metadata: LectureMetadata;
}

interface LectureAddProps {
  initialLecture?: Lecture;
  onSubmit?: (lectureData: Lecture) => Promise<void>;
  isEditing?: boolean;
}

const LectureAdd: React.FC<LectureAddProps> = ({ initialLecture, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture>(initialLecture || {
    metadata: {
      format: 'Lecture',
      date: new Date().toISOString().split('T')[0],
      course: '',
      title: '',
      path: ''
    }
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showConfig, setShowConfig] = useState(false);
  
  // Configuration state
  const [config, setConfig] = useState({
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
useEffect(() => {
    loadCourses();
}, []);

useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'loading') {
        timer = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
        }, 1000);
    } else {
        setElapsedTime(0);
    }
    return () => clearInterval(timer);
}, [status]);

const loadCourses = async () => {
    try {
        const response = await fetchCourses();
        setCourses(response.data);
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLecture((prevLecture) => ({
        ...prevLecture,
        metadata: { ...prevLecture.metadata, [name]: value }
    }));
};

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        setPdfFile(event.target.files[0]);
    }
};


const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setConfig(prevConfig => {
    const newValue = value.includes(',')
      ? value.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num))
      : parseInt(value, 10);
    
    return {
      ...prevConfig,
      [name]: newValue
    };
  });
};


const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setStatus('loading');
  setMessage('');
  setGeneratedData(null);

  try {
    let pdfUrl = lecture.metadata.path;

    if (pdfFile) {
      const response = await uploadPdfFile(pdfFile);
      pdfUrl = response.data.fileUrl;
      setLecture((prevLecture) => ({
        ...prevLecture,
        metadata: { ...prevLecture.metadata, path: pdfUrl }
      }));
    }

    if (!pdfUrl) throw new Error('PDF file or URL is required');

    // Use the full config object when generating the lecture
    const requestBody = { metadata: { ...lecture.metadata, path: pdfUrl }, config };
    
    const response = await generateLecture(requestBody);

    setStatus('success');
    setMessage('Lecture generated successfully!');
    setGeneratedData(response.data);

  } catch (error) {
        console.error('Error:', error);
        setStatus('error');

        if (axios.isAxiosError(error) && error.response) {
            setMessage(`Error generating lecture. ${error.response.status} - ${error.response.data.message || error.message}`);
        } else {
            setMessage(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
};

const handleSave = async () => {
    if (!generatedData) return;

    try {
        const lectureData = { ...generatedData, metadata: { ...generatedData.metadata, ...lecture.metadata } };

        if (onSubmit) {
            await onSubmit(lectureData);
        } else {
            await saveLecture(lectureData);

            setStatus('success');
            setMessage(isEditing ? 'Lecture updated successfully!' : 'Lecture added successfully!');

            setTimeout(() => navigate('/lectures'), 2000);
        }

    } catch (error) {
        console.error('Error saving lecture:', error);
        setStatus('error');

        if (axios.isAxiosError(error) && error.response) {
            setMessage(`Error saving lecture. ${error.response.status} - ${error.response.data.message || error.message}`);
        } else {
            setMessage(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
};

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">{isEditing ? 'Edit Lecture' : 'Add New Lecture'}</h2>

      {status === 'loading' && (
        <Alert variant="info">
          <Spinner animation="border" size="sm" /> Generating lecture... (Elapsed time: {elapsedTime}s)
        </Alert>
      )}

      {message && (
        <Alert variant={status === 'error' ? 'danger' : 'success'}>{message}</Alert>
      )}

      <LectureForm
        lecture={lecture}
        courses={courses}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        status={status}
        navigate={navigate}
      />

      <ConfigurationSection
        config={config}
        handleConfigChange={handleConfigChange}
        showConfig={showConfig}
        setShowConfig={setShowConfig}
        setConfig={setConfig}
      />

      {generatedData && (
        <GeneratedDataSection
          generatedData={generatedData}
          handleSave={handleSave}
          isEditing={isEditing}
        />
      )}
    </Container>
  );
};

export default LectureAdd;