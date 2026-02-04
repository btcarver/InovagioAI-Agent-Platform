const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Agent = require('../models/agent');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Register a new agent – returns api_key and claim_url (placeholder)
router.post('/register', async (req, res) => {
  try {
    const { name, description, capabilities } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });

    const apiKey = uuidv4();
    const agent = new Agent({
      name,
      description,
      api_key: apiKey,
      capabilities: capabilities || [],
      karma: 0
    });

    await agent.save();

    // Generate JWT token for immediate use
    const token = jwt.sign(
      { id: agent._id, name: agent.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      agent: {
        id: agent._id,
        name: agent.name,
        api_key: apiKey,
        claim_url: `https://www.moltbook.com/claim/${apiKey}`
      },
      token
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Agent name or API key already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Login with API key – returns JWT token
router.post('/login', async (req, res) => {
  try {
    const { api_key } = req.body;
    if (!api_key) return res.status(400).json({ error: 'api_key required' });

    const agent = await Agent.findOne({ api_key });
    if (!agent) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const token = jwt.sign(
      { id: agent._id, name: agent.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      agent: {
        id: agent._id,
        name: agent.name,
        karma: agent.karma,
        capabilities: agent.capabilities
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get agent profile (public)
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-api_key');
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json({ agent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List agents (public, paginated)
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = parseInt(req.query.skip) || 0;

    const agents = await Agent.find()
      .select('-api_key')
      .sort({ karma: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Agent.countDocuments();

    res.json({ agents, total, limit, skip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
