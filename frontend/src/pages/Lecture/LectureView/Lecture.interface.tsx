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

export default Lecture;