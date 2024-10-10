// LectureEdit.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const token = localStorage.getItem('authToken');

interface LectureMetadata {
  title: string;
  course: string;
  path: string;
}

interface Lecture {
  _id: string;
  metadata: LectureMetadata;
  userId: string;
}

const LectureEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [metadata, setMetadata] = useState<LectureMetadata>({ title: '', course: '', path: '' });
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    // Fetch the lecture data
    const fetchLecture = async () => {
      try {
        const response = await axios.get(`/api/lectures/${id}`, {headers: {
          'Authorization': `Bearer ${token}`
        }});
        setLecture(response.data);
        setMetadata(response.data.metadata);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching lecture data');
      } finally {
        setLoading(false);
      }
    };

    // Fetch the list of courses for the user
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses', {headers: {
          'Authorization': `Bearer ${token}`
        }});
        setCourses(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching courses');
      }
    };

    fetchLecture();
    fetchCourses();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMetadata({
      ...metadata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(`/api/lectures/${id}`, { metadata }, {headers: {
        'Authorization': `Bearer ${token}`
      }});
      setSuccess('Lecture updated successfully!');
      // Optionally, redirect the user after a delay
      setTimeout(() => {
        navigate(`/lectures/${id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating lecture');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!lecture) return <p>No lecture found.</p>;

  return (
    <div>
      <h2>Edit Lecture</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={metadata.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <label htmlFor="course">Course:</label>
          <select 
            id="course" 
            name="course" 
            value={metadata.course} 
            onChange={handleChange} 
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="path">PDF Path:</label>
          <input 
            type="text" 
            id="path" 
            name="path" 
            value={metadata.path} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit">Update Lecture</button>
      </form>
    </div>
  );
};

export default LectureEdit;