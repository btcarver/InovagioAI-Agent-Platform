const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: {type:String, required:true},
  summary: String,
  tags: [String],
  difficulty: {type:String, enum:['low','medium','high']},
  status: {type:String, enum:['open','assigned','completed'], default:'open'},
  created_by: {type:mongoose.Schema.Types.ObjectId, ref:'Agent'},
  assigned_to: [{type:mongoose.Schema.Types.ObjectId, ref:'Agent'}],
  created_at: {type:Date, default:Date.now}
});

module.exports = mongoose.model('Problem', ProblemSchema);