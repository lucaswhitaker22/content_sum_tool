// Lecture.interface.tsx
import {Course} from '../interfaces/Course.interface'
export interface GradingSchemeItem {
    item: string;
    weight: number;
  }
  

export interface GeneratedDataSectionProps {
    generatedData: any;
    handleSave: () => void;
    isEditing: boolean;
  }

  export interface ConfigurationType {
    metadata_overview_sentences: number[],
    metadata_key_topics: number[],
    metadata_topic_description_sentences: number[],
    notes_word_count_range: number[],
    review_question_count: number[],
    review_answer_explanation_sentences: number[],
    practice_multiple_choice_count: number,
    practice_multiple_choice_options: number,
    practice_short_answer_count: number[],
    practice_long_answer_count: number[],
    practice_answer_explanation_sentences: number[],
    keywords_term_count: number[],
    keywords_definition_sentences: number[]
  }
export interface LectureMetadata {
    format: string;
    date: string;
    course: string;
    title: string;
    path: string;
  }

export interface Lecture {
  _id: string;
  metadata: {
    overview: string;
    topics: string[];
    format: string;
    date: string;
    course: Course; // Changed from string to Course object
    title: string;
    path: string;
  };
  notes: string;
  review: {
    question: string;
    answer: string;
  }[];
  keywords: {
    term: string;
    definition: string;
  }[];
  practice: {
    long: {
      question: string;
      answer: string;
    }[];
    multiple: {
      question: string;
      options: string[];
      answer: string;
      explanation: string;
    }[];
    short: {
      question: string;
      answer: string;
    }[];
  };
}