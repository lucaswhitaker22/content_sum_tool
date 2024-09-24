import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage'; // Import the new HomePage component
import LectureList from './pages/Lecture/LectureList/LectureList';
import LectureView from './pages/Lecture/LectureView/LectureView';
import Login from './pages/User/LoginPage';
import LectureAdd from './pages/Lecture/LectureAdd/LectureAdd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css';

import { Container, Nav, Navbar } from 'react-bootstrap';
const App: React.FC = () => {
  return (
    <Router>
        <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Your App Name</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/lectures">Lectures</Nav.Link>
              <Nav.Link href="/lecture/new">Generate</Nav.Link>
              
            </Nav>


          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lectures" element={<LectureList />} />
        <Route path="/lecture/:id" element={<LectureView />} />
        <Route path="/lecture/new" element={<LectureAdd />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  );
};

export default App;