import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Course, ScheduleItem } from '../../Course.interface';
import './CourseDetailsModal.css'; // Make sure to create this CSS file

interface CourseDetailsModalProps {
  show: boolean;
  onHide: () => void;
  course: Course | null;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ show, onHide, course }) => {
  if (!course) return null;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const getScheduleForDay = (day: string): ScheduleItem[] => {
    return course.schedule.filter(item => item.dayOfWeek === day);
  };

  const renderTimeSlot = (time: string, day: string) => {
    const scheduleItems = getScheduleForDay(day);
    const matchingItem = scheduleItems.find(item => {
      const [startHour] = item.startTime.split(':');
      return startHour === time.split(':')[0];
    });

    if (matchingItem) {
      return (
        <div className="schedule-item">
          <strong>{matchingItem.type}</strong>
          <br />
          {matchingItem.startTime}-{matchingItem.endTime}
          <br />
          {matchingItem.location}
        </div>
      );
    }
    return null;
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          {course.department} {course.number}: {course.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Professor:</strong> {course.professor}</p>
        <p><strong>Term:</strong> {course.term} {course.year}</p>
        
        {course.outlineUrl && (
          <p>
            <strong>Course Outline:</strong>{' '}
            <a href={course.outlineUrl} target="_blank" rel="noopener noreferrer">
              View Outline
            </a>
          </p>
        )}

        {course.gradingScheme && course.gradingScheme.length > 0 && (
          <>
            <h5>Grading Scheme:</h5>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {course.gradingScheme.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item}</td>
                    <td>{item.weight}%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {course.schedule && course.schedule.length > 0 && (
          <>
            <h5>Weekly Schedule:</h5>
            <div className="weekly-schedule-container">
              <Table bordered className="weekly-schedule">
                <thead>
                  <tr>
                    <th>Time</th>
                    {daysOfWeek.map(day => <th key={day}>{day}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(time => (
                    <tr key={time}>
                      <td>{time}</td>
                      {daysOfWeek.map(day => (
                        <td key={`${day}-${time}`}>
                          {renderTimeSlot(time, day)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CourseDetailsModal;