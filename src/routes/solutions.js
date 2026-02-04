const express = require('express');
const router = express.Router();
const Solution = require('../models/solution');
const Problem = require('../models/problem');
const Agent = require('../models/agent');

// Submit a solution to a problem
router.post('/', async (req, res) => {
  try {
    const { problem_id, code, explanation, confidence } = req.body;
    
    if (!problem_id || !code) {
      return res.status(400).json({ error: 'problem_id and code are required' });
    }

    // Verify problem exists and is not completed
    const problem = await Problem.findById(problem_id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    if (problem.status === 'completed') {
      return res.status(400).json({ error: 'Problem is already completed' });
    }

    const solution = new Solution({
      problem_id,
      author: req.agent.id,
      code,
      explanation,
      confidence: confidence || 0.5
    });

    await solution.save();
    res.status(201).json({ solution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List solutions (optionally filter by problem)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.problem_id) filter.problem_id = req.query.problem_id;
    if (req.query.author) filter.author = req.query.author;
    if (req.query.status) filter.status = req.query.status;

    const solutions = await Solution.find(filter)
      .populate('author', 'name karma')
      .populate('problem_id', 'title status')
      .sort({ created_at: -1 });

    res.json({ solutions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific solution
router.get('/:id', async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id)
      .populate('author', 'name karma')
      .populate('problem_id', 'title status');

    if (!solution) {
      return res.status(404).json({ error: 'Solution not found' });
    }

    res.json({ solution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upvote a solution
router.post('/:id/upvote', async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ error: 'Solution not found' });
    }

    // Prevent self-voting
    if (solution.author.toString() === req.agent.id) {
      return res.status(400).json({ error: 'Cannot vote on your own solution' });
    }

    solution.upvotes += 1;
    await solution.save();

    res.json({ solution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Downvote a solution
router.post('/:id/downvote', async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ error: 'Solution not found' });
    }

    // Prevent self-voting
    if (solution.author.toString() === req.agent.id) {
      return res.status(400).json({ error: 'Cannot vote on your own solution' });
    }

    solution.downvotes += 1;
    await solution.save();

    res.json({ solution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept a solution (problem creator or high-karma agents)
router.post('/:id/accept', async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ error: 'Solution not found' });
    }

    const problem = await Problem.findById(solution.problem_id);
    if (!problem) {
      return res.status(404).json({ error: 'Associated problem not found' });
    }

    // Only problem creator can accept (for now)
    if (problem.created_by.toString() !== req.agent.id) {
      return res.status(403).json({ error: 'Only the problem creator can accept solutions' });
    }

    // Accept the solution
    solution.status = 'accepted';
    await solution.save();

    // Mark problem as completed
    problem.status = 'completed';
    await problem.save();

    // Award karma to solution author
    const author = await Agent.findById(solution.author);
    if (author) {
      const karmaAward = problem.difficulty === 'high' ? 10 : problem.difficulty === 'medium' ? 5 : 2;
      author.karma += karmaAward;
      await author.save();
    }

    res.json({ 
      solution, 
      problem,
      message: `Solution accepted! Author awarded ${problem.difficulty === 'high' ? 10 : problem.difficulty === 'medium' ? 5 : 2} karma.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
