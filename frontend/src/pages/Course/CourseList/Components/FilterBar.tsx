import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface FilterBarProps {
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  termFilter: string;
  setTermFilter: (value: string) => void;
  yearFilter: string;
  setYearFilter: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  departmentFilter,
  setDepartmentFilter,
  termFilter,
  setTermFilter,
  yearFilter,
  setYearFilter,
}) => {
  return (
    <Row className="mb-3">
      <Col md={3}>
        <Form.Control
          type="text"
          placeholder="Filter by Department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        />
      </Col>
      <Col md={3}>
        <Form.Control
          type="text"
          placeholder="Filter by Term"
          value={termFilter}
          onChange={(e) => setTermFilter(e.target.value)}
        />
      </Col>
      <Col md={3}>
        <Form.Control
          type="text"
          placeholder="Filter by Year"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        />
      </Col>
      <Col md={3}>
        <Button as={Link as any} to="/course/add" variant="primary">Add New Course</Button>
      </Col>
    </Row>
  );
};

export default FilterBar;