import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { GradingSchemeItem } from '../../../../interfaces/Course.interface';

interface GradingSchemeProps {
  gradingScheme: GradingSchemeItem[];
  setGradingScheme: (scheme: GradingSchemeItem[]) => void;
}

const GradingScheme: React.FC<GradingSchemeProps> = ({ gradingScheme, setGradingScheme }) => {
  const handleGradingSchemeChange = (index: number, field: 'item' | 'weight', value: string) => {
    const updatedScheme = [...gradingScheme];
    updatedScheme[index] = {
      ...updatedScheme[index],
      [field]: field === 'weight' ? parseFloat(value) : value
    };
    setGradingScheme(updatedScheme);
  };

  const addGradingSchemeItem = () => {
    setGradingScheme([...gradingScheme, { item: '', weight: 0 }]);
  };

  const removeGradingSchemeItem = (index: number) => {
    const updatedScheme = [...gradingScheme];
    updatedScheme.splice(index, 1);
    setGradingScheme(updatedScheme);
  };

  return (
    <>
      <h3>Grading Scheme</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Item</th>
            <th>Weight (%)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {gradingScheme.map((item, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  value={item.item}
                  onChange={(e) => handleGradingSchemeChange(index, 'item', e.target.value)}
                  placeholder="Item"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.weight}
                  onChange={(e) => handleGradingSchemeChange(index, 'weight', e.target.value)}
                  placeholder="Weight"
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => removeGradingSchemeItem(index)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={addGradingSchemeItem}>Add Grading Item</Button>
    </>
  );
};

export default GradingScheme;