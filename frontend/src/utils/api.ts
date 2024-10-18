import axios from 'axios';
import { Lecture } from '../interfaces/Lecture.interface';
import { Course } from '../interfaces/Course.interface';

const API_BASE_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('authToken');

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Lecture-related API calls
export const fetchLectures = () => api.get<Lecture[]>('/lectures');
export const deleteLecture = (id: string) => api.delete(`/lectures/${id}`);

// Course-related API calls
export const fetchCourse = (id: string) => api.get<Course>(`/courses/${id}`);
export const createCourse = (courseData: Partial<Course>) => api.post<Course>('/courses', courseData);
export const updateCourse = (id: string, courseData: Partial<Course>) => api.put<Course>(`/courses/${id}`, courseData);
export const deleteCourse = (id: string) => api.delete(`/courses/${id}`);
export const fetchCourses = () => api.get<Course[]>('/courses');

export default api;