const mongoose = require('mongoose');

const gradingSchemeItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  weight: { type: Number, required: true, min: 0, max: 100 }
});

const courseSchema = new mongoose.Schema({
  department: { type: String, required: true },
  number: { type: String, required: true },
  professor: { type: String, required: true },
  term: { type: String, required: true },
  year: { type: Number, required: true },
  title: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // New optional fields
  gradingScheme: [gradingSchemeItemSchema],
  outlineUrl: { type: String }
});

module.exports = mongoose.model('Course', courseSchema);