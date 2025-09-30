const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const StepSchema = new mongoose.Schema({
  userId: String,
  timestamp: Number,
  steps: Number
});
const Step = mongoose.model('Step', StepSchema);

app.post('/steps', async (req, res) => {
  try {
    const { userId, timestamp, steps } = req.body;
    if (timestamp == null || steps == null) return res.status(400).send('Bad request');
    await Step.create({ userId, timestamp, steps });
    res.status(201).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/steps', async (req, res) => {
  const { userId } = req.query;
  const q = userId ? { userId } : {};
  const data = await Step.find(q).sort({ timestamp: 1 }).limit(1000);
  res.json(data);
});

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stepdb')
.then(() => {
  app.listen(PORT, () => console.log('Server listening on', PORT));
}).catch(err => console.error(err));
