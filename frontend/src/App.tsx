import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/Home/HomePage'; // Import the new HomePage component
import LectureList from './pages/Lecture/LectureList/LectureList';
import LectureView from './pages/Lecture/LectureView/LectureView';
import Login from './pages/User/LoginPage';
import LectureAdd from './pages/Lecture/LectureAdd/LectureAdd';

import CoursePage from './pages/Course/CoursePage';
import CourseList from './pages/Course/CourseList'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css';

import { Container, Nav, Navbar } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.withCredentials = true;
const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user', { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/api/logout', { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <Router>
<Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">LectureGPT</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/lectures">Lectures</Nav.Link>
                <Nav.Link as={Link} to="/lecture/new">Add Lecture</Nav.Link>
                <Nav.Link as={Link} to="/about">About</Nav.Link>
                <Nav.Link as={Link} to="/course/add">Courses</Nav.Link>

              </Nav>
              <Nav>
                {user ? (
                  <>
                    <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </>
                ) : (
                  <Nav.Link href="http://localhost:3000/auth/google">Login with Google</Nav.Link>
                  
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lectures" element={<LectureList />} />
        <Route path="/lecture/:id" element={<LectureView />} />
        <Route path="/lecture/add" element={<LectureAdd />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/course/add" element={<CoursePage/>} />
        <Route path="/course/list" element={<CourseList/>} />
      </Routes>
    </Router>
  );
};

export default App;