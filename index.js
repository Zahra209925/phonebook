const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Person = require('./models/person'); // Tuo Mongoose-malli

dotenv.config(); // Lataa ympäristömuuttujat .env-tiedostosta

const app = express();

// Middlewaret
app.use(express.json()); // JSON-datan käsittelyyn
morgan.token('body', (req) => JSON.stringify(req.body)); // Luo Morgan-token POST-datalle
const customMorganFormat = ':method :url :status :res[content-length] - :response-time ms :body';
app.use(morgan(customMorganFormat)); // Ota käyttöön mukautettu Morgan-formaatti

// MongoDB-yhteys
const uri = `mongodb+srv://fullstack:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@cluster0.q0iag.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// GET /api/persons - Hae kaikki henkilöt tietokannasta
app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      console.error('Error fetching persons:', error.message);
      res.status(500).end();
    });
});

// POST /api/persons - Lisää uusi henkilö tietokantaan
app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.status(201).json(savedPerson);
    })
    .catch((error) => {
      console.error('Error saving person:', error.message);
      res.status(500).end();
    });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});