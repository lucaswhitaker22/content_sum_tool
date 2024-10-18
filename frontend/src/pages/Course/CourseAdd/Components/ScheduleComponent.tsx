import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { ScheduleItem } from '../../../../interfaces/Course.interface';

interface ScheduleComponentProps {
  schedule: ScheduleItem[];
  setSchedule: (schedule: ScheduleItem[]) => void;
}

const ScheduleComponent: React.FC<ScheduleComponentProps> = ({ schedule, setSchedule }) => {
  const daysOfWeek = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ];

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: any) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    setSchedule(updatedSchedule);
  };

  const addScheduleItem = () => {
    setSchedule([...schedule, { dayOfWeek: '', startTime: '', endTime: '', location: '', type: '' }]);
  };

  const removeScheduleItem = (index: number) => {
    const updatedSchedule = [...schedule];
    updatedSchedule.splice(index, 1);
    setSchedule(updatedSchedule);
  };

  return (
    <>
      <h3>Schedule</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Day of Week</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Location</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>
                <Select
                  options={daysOfWeek}
                  value={daysOfWeek.find(day => day.value === item.dayOfWeek)}
                  onChange={(selectedOption) => handleScheduleChange(index, 'dayOfWeek', selectedOption ? selectedOption.value : '')}
                />
              </td>
              <td>
                <Form.Control
                  type="time"
                  value={item.startTime}
                  onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="time"
                  value={item.endTime}
                  onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={item.location}
                  onChange={(e) => handleScheduleChange(index, 'location', e.target.value)}
                  placeholder="Location"
                />
              </td>
              <td>
                <Form.Select
                  value={item.type}
                  onChange={(e) => handleScheduleChange(index, 'type', e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab</option>
                  <option value="Tutorial">Tutorial</option>
                </Form.Select>
              </td>
              <td>
                <Button variant="danger" onClick={() => removeScheduleItem(index)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={addScheduleItem}>Add Schedule Item</Button>
    </>
  );
};

export default ScheduleComponent;