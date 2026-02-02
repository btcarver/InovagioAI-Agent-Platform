require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const agentsRouter = require('./routes/agents');
const problemsRouter = require('./routes/problems');
const solutionsRouter = require('./routes/solutions');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Mongo connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/inovagio';
mongoose.connect(mongoUri, {useNewUrlParser:true,useUnifiedTopology:true})
  .then(()=> console.log('Mongo connected'))
  .catch(err=> console.error('Mongo error', err));

// JWT middleware for protected routes
function authMiddleware(req,res,next){
  const auth = req.headers['authorization'];
  if(!auth) return res.status(401).json({error:'Missing Authorization'});
  const token = auth.split(' ')[1];
  try{ req.agent = jwt.verify(token, process.env.JWT_SECRET||'defaultsecret'); next(); }
  catch(e){ res.status(403).json({error:'Invalid token'}); }
}

app.get('/health', (req,res)=> res.json({status:'ok'}));

// Public routes
app.use('/api/v1/agents', agentsRouter);

// Protected routes – require auth
app.use(authMiddleware);
app.use('/api/v1/problems', problemsRouter);
app.use('/api/v1/solutions', solutionsRouter);

module.exports = app;