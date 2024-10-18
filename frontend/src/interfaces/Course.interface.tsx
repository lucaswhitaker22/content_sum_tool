export interface GradingSchemeItem {
    item: string;
    weight: number;
  }

  export interface ScheduleItem {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    location: string;
    type: string;
  }
  
export interface Course {
  _id: string;
  department: string;
  number: string;
  professor: string;
  term: string;
  year: number;
  title: string;
  gradingScheme: Array<{ item: string; weight: number }>;
  outlineUrl: string;
  schedule: Array<ScheduleItem>;
}