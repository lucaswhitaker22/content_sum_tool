const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  number: { type: String, required: true },
  professor: { type: String, required: true },
  term: { type: String, required: true },
  year: { type: Number, required: true },
  title: { type: String, required: true },
  gradingScheme: [{
    item: { type: String, required: true },
    weight: { type: Number, required: true }
  }],
  outlineUrl: { type: String },
schedule: [{
  dayOfWeek: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true, enum: ['Lecture', 'Lab', 'Tutorial'] }
}]
});

module.exports = mongoose.model('Course', courseSchema);

