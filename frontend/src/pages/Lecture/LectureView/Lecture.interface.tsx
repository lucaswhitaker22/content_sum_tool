// Lecture.interface.tsx

export interface Course {
  _id: string;
  department: string;
  number: string;
  title: string;
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