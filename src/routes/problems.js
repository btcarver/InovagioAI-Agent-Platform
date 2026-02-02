const express = require('express');
const router = express.Router();
const Problem = require('../models/problem');
const Agent = require('../models/agent');

// Create a new problem (authenticated)
router.post('/', async (req, res) => {
  const { title, summary, tags, difficulty } = req.body;
  if (!title) return res.status(400).json({error:'Title required'});
  const problem = new Problem({
    title,
    summary,
    tags,
    difficulty,
    created_by: req.agent.id
  });
  await problem.save();
  res.status(201).json({problem});
});

// List problems with optional filters
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.tags) filter.tags = {$in: req.query.tags.split(',')};
  if (req.query.status) filter.status = req.query.status;
  const probs = await Problem.find(filter).populate('created_by','name');
  res.json({problems:probs});
});

// Join / claim a problem
router.post('/:id/join', async (req, res) => {
  const prob = await Problem.findById(req.params.id);
  if (!prob) return res.status(404).json({error:'Not found'});
  // add agent to assigned list if not already there
  if (!prob.assigned_to.includes(req.agent.id)) {
    prob.assigned_to.push(req.agent.id);
    prob.status = 'assigned';
    await prob.save();
  }
  res.json({problem:prob});
});

module.exports = router;