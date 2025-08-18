const mongoose = require('mongoose');

const editorialSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    unique: true,
  },
  solutions: [
    {
      approachName: { type: String, required: true },
      algorithm: { type: String, required: true },
      implementation: { type: String, required: true },
      complexityAnalysis: [
        {
          complexity: { type: String, required: true }, // e.g., "Time Complexity", "Space Complexity"
          explanation: { type: String, required: true }
        }
      ]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// Update the updatedAt field before saving
editorialSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Editorial', editorialSchema);