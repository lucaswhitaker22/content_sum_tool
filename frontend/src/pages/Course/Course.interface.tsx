export interface GradingSchemeItem {
    item: string;
    weight: number;
  }
  
export interface Course {
    _id: string;
    department: string;
    number: string;
    professor: string;
    term: string;
    year: number;
    title: string;
    gradingScheme?: GradingSchemeItem[];
    outlineUrl?: string;
  }