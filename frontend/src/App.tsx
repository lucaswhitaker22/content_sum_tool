import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import LectureList from './pages/Lecture/LectureList/LectureList';
import LectureView from './pages/Lecture/LectureView/LectureView';

// Create a theme (optional)
const theme = createTheme({
  // Your theme overrides here
});

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/lectures" element={<LectureList />} />
          <Route path="/lecture/:id" element={<LectureView />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;