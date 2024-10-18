import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { GeneratedDataSectionProps } from '../../../../interfaces/Lecture.interface';


const GeneratedDataSection: React.FC<GeneratedDataSectionProps> = ({
  generatedData,
  handleSave,
  isEditing
}) => {
  return (
    <div className="mt-4">
      <h3>Generated Lecture Data:</h3>
      <Card>
        <Card.Body>
          <pre style={{ maxHeight: '400px', overflow: 'auto' }}>
            {JSON.stringify(generatedData, null, 2)}
          </pre>
        </Card.Body>
      </Card>
      <Button variant="success" onClick={handleSave} className="mt-3">
        {isEditing ? 'Update Lecture' : 'Save Lecture'}
      </Button>
    </div>
  );
};

export default GeneratedDataSection;