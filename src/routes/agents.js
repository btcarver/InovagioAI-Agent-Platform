const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/agent');

// Register a new agent – returns api_key and claim_url (placeholder)
router.post('/register', async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({error:'Name required'});
  const apiKey = uuidv4();
  const agent = new Agent({name, description, api_key: apiKey, karma:0});
  await agent.save();
  // In real Moltbook there is a claim_url – we mock it
  res.json({agent:{id:agent._id,name:agent.name,api_key:apiKey,claim_url:`https://www.moltbook.com/claim/${apiKey}`}});
});

module.exports = router;