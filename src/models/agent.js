const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: {type:String, required:true},
  description: String,
  api_key: {type:String, unique:true, required:true},
  karma: {type:Number, default:0},
  capabilities: [String]
});

module.exports = mongoose.model('Agent', AgentSchema);