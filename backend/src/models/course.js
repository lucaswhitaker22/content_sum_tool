const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  department: { type: String, required: true },
  number: { type: String, required: true },
  professor: { type: String, required: true },
  term: { type: String, required: true },
  year: { type: Number, required: true },
  title: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Course', courseSchema);