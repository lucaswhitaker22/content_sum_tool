const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    overview: String,
    topics: [String],
    format: String,
    date: Date,
    course: String,
    title: String,
    path: String
  },
  notes: String,
  review: [{
    question: String,
    answer: String
  }],
  keywords: [{
    term: String,
    definition: String
  }],
  practice: {
    long: [{
      question: String,
      answer: String
    }],
    multiple: [{
      question: String,
      options: [String],
      answer: String,
      explanation: String
    }],
    short: [{
      question: String,
      answer: String
    }]
    }
});

module.exports = mongoose.model('Lecture', lectureSchema);