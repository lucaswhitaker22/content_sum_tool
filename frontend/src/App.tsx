import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage'; // Import the new HomePage component
import LectureList from './pages/Lecture/LectureList/LectureList';
import LectureView from './pages/Lecture/LectureView/LectureView';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lectures" element={<LectureList />} />
        <Route path="/lecture/:id" element={<LectureView />} />
      </Routes>
    </Router>
  );
};

export default App;