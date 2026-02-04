const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
  problem_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  code: { type: String, required: true },
  explanation: String,
  confidence: { type: Number, min: 0, max: 1, default: 0.5 },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update timestamp on save
SolutionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Virtual for net score
SolutionSchema.virtual('score').get(function() {
  return this.upvotes - this.downvotes;
});

// Include virtuals in JSON
SolutionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Solution', SolutionSchema);
