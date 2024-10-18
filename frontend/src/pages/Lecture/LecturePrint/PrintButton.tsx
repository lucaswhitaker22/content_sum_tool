import React, { useState } from 'react';
import { Lecture, Course } from '../../../interfaces/Lecture.interface';
import ReactMarkdown from 'react-markdown';
import { renderToString } from 'react-dom/server';
import { Button, Modal, Form } from 'react-bootstrap';

interface PrintButtonProps {
  lecture: Lecture;
}

interface SelectedSections {
  overview: boolean;
  topics: boolean;
  notes: boolean;
  keywords: boolean;
  review: boolean;
  practice: boolean;
  includeAnswers: boolean;
}

const getPrintContent = (lecture: Lecture, selectedSections: SelectedSections) => {
  const renderedNotes = selectedSections.notes 
    ? renderToString(<ReactMarkdown>{lecture.notes}</ReactMarkdown>) 
    : '';

  return `
    <html>
      <head>
        <title>${lecture.metadata.title}</title>
        <style>
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.3;
            color: #333;
            max-width: 100%;
            margin: 0;
            padding: 0;
          }
          h1 {
            font-size: 18pt;
            margin-bottom: 10px;
            text-align: center;
          }
          h2 {
            font-size: 14pt;
            margin-top: 15px;
            margin-bottom: 5px;
          }
          h3 {
            font-size: 12pt;
            margin-top: 10px;
            margin-bottom: 5px;
          }
          h1, h2, h3 {
            color: #2c3e50;
            border-bottom: 1px solid #2c3e50;
            padding-bottom: 3px;
          }
          .section {
            margin-bottom: 15px;
          }
          .keyword {
            background-color: #f8f9fa;
            padding: 5px;
            margin: 5px 0;
            border-radius: 3px;
          }
          .keyword-space {
            height: 50px;
            border-bottom: 1px dashed #ccc;
            margin-bottom: 10px;
          }
          .question {
            font-weight: bold;
            margin-top: 10px;
            page-break-inside: avoid;
          }
          .answer-space {
            height: 120px;
            border-bottom: 1px solid #ccc;
            margin-bottom: 10px;
          }
          .answer {
            margin-top: 5px;
            padding: 5px;
            background-color: #f0f0f0;
            border-radius: 3px;
          }
          .page-break {
            page-break-before: always;
          }
          .lecture-info {
            text-align: center;
            margin-bottom: 20px;
          }
          @media print {
            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="lecture-info">
          <h1>${lecture.metadata.title}</h1>
          <p><strong>Course:</strong> ${lecture.metadata.course.department} ${lecture.metadata.course.number} - ${lecture.metadata.course.title}</p>
          <p><strong>Date:</strong> ${lecture.metadata.date}</p>
          <p><strong>Format:</strong> ${lecture.metadata.format}</p>
        </div>
        ${selectedSections.overview || selectedSections.topics ? `
          <div class="section">
            ${selectedSections.overview ? `
              <h2>Overview</h2>
              <p>${lecture.metadata.overview}</p>
            ` : ''}
            ${selectedSections.topics ? `
              <h2>Topics</h2>
              <ul>
                ${lecture.metadata.topics.map(topic => `<li>${topic}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        ` : ''}
        ${selectedSections.notes ? `
          <div class="page-break"></div>
          <div class="section">
            <h2>Notes</h2>
            ${renderedNotes}
          </div>
        ` : ''}
        ${selectedSections.keywords ? `
          <div class="page-break"></div>
          <div class="section">
            <h2>Keywords</h2>
            ${lecture.keywords.map(keyword => `
              <div class="keyword">
                <strong>${keyword.term}</strong>
              </div>
              <div class="keyword-space"></div>
            `).join('')}
          </div>
          ${selectedSections.includeAnswers ? `
            <div class="page-break"></div>
            <div class="section">
              <h2>Keyword Definitions</h2>
              ${lecture.keywords.map(keyword => `
                <div class="keyword">
                  <strong>${keyword.term}:</strong> ${keyword.definition}
                </div>
              `).join('')}
            </div>
          ` : ''}
        ` : ''}
        ${selectedSections.review ? `
          <div class="page-break"></div>
          <div class="section">
            <h2>Review Questions</h2>
            ${lecture.review.map((item, index) => `
              <div class="question">
                ${index + 1}. ${item.question}
              </div>
              <div class="answer-space"></div>
            `).join('')}
          </div>
          ${selectedSections.includeAnswers ? `
            <div class="page-break"></div>
            <div class="section">
              <h2>Review Answer Key</h2>
              ${lecture.review.map((item, index) => `
                <div class="question">
                  ${index + 1}. ${item.question}
                </div>
                <div class="answer">
                  ${item.answer}
                </div>
              `).join('')}
            </div>
          ` : ''}
        ` : ''}
        ${selectedSections.practice ? `
          <div class="page-break"></div>
          <div class="section">
            <h2>Practice Questions</h2>
            <h3>Long Answer Questions</h3>
            ${lecture.practice.long.map((item, index) => `
              <div class="question">
                ${index + 1}. ${item.question}
              </div>
              <div class="answer-space"></div>
            `).join('')}
            <h3>Multiple Choice Questions</h3>
            ${lecture.practice.multiple.map((item, index) => `
              <div class="question">
                ${index + 1}. ${item.question}
              </div>
              <ul>
                ${item.options.map((option, optIndex) => `
                  <li>${String.fromCharCode(97 + optIndex)}. ${option}</li>
                `).join('')}
              </ul>
              <div class="answer-space"></div>
            `).join('')}
            <h3>Short Answer Questions</h3>
            ${lecture.practice.short.map((item, index) => `
              <div class="question">
                ${index + 1}. ${item.question}
              </div>
              <div class="answer-space"></div>
            `).join('')}
          </div>
          ${selectedSections.includeAnswers ? `
            <div class="page-break"></div>
            <div class="section">
              <h2>Practice Answer Key</h2>
              <h3>Long Answer Questions</h3>
              ${lecture.practice.long.map((item, index) => `
                <div class="question">
                  ${index + 1}. ${item.question}
                </div>
                <div class="answer">
                  ${item.answer}
                </div>
              `).join('')}
              <h3>Multiple Choice Questions</h3>
              ${lecture.practice.multiple.map((item, index) => `
                <div class="question">
                  ${index + 1}. ${item.question}
                </div>
                <div class="answer">
                  Answer: ${item.answer}
                  <br>
                  Explanation: ${item.explanation}
                </div>
              `).join('')}
              <h3>Short Answer Questions</h3>
              ${lecture.practice.short.map((item, index) => `
                <div class="question">
                  ${index + 1}. ${item.question}
                </div>
                <div class="answer">
                  ${item.answer}
                </div>
              `).join('')}
            </div>
          ` : ''}
        ` : ''}
      </body>
    </html>
  `;
};

export const PrintButton: React.FC<PrintButtonProps> = ({ lecture }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSections, setSelectedSections] = useState<SelectedSections>({
    overview: true,
    topics: true,
    notes: true,
    keywords: true,
    review: true,
    practice: true,
    includeAnswers: false
  });

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(getPrintContent(lecture, selectedSections));
      printWindow.document.close();
      printWindow.print();
    }
    setShowModal(false);
  };

  const toggleSection = (section: keyof SelectedSections) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Print Lecture</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select sections to print</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.entries(selectedSections).map(([key, value]) => (
              key !== 'includeAnswers' && (
                <Form.Check 
                  key={key}
                  type="checkbox"
                  id={`check-${key}`}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  checked={value}
                  onChange={() => toggleSection(key as keyof SelectedSections)}
                />
              )
            ))}
            <Form.Check 
              type="checkbox"
              id="check-includeAnswers"
              label="Include Answers"
              checked={selectedSections.includeAnswers}
              onChange={() => toggleSection('includeAnswers')}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};