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

// GET /api/persons/:id - Hae yksittäinen henkilö ID:n perusteella
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end(); // Jos henkilöä ei löydy
      }
    })
    .catch((error) => next(error)); // Siirrä virhe seuraavaan middlewareen
});

// POST /api/persons - Lisää uusi henkilö tietokantaan
app.post('/api/persons', (req, res, next) => {
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
    .catch((error) => next(error));
});

// PUT /api/persons/:id - Päivitä henkilön tiedot
app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;

  const updatedPerson = { name, number };

  Person.findByIdAndUpdate(id, updatedPerson, { new: true, runValidators: true, context: 'query' })
    .then((result) => {
      if (result) {
        res.json(result); // Palauta päivitetyt tiedot
      } else {
        res.status(404).send({ error: 'Person not found' }); // Jos henkilöä ei löydy
      }
    })
    .catch((error) => next(error)); // Siirrä virhe seuraavaan middlewareen
});

// DELETE /api/persons/:id - Poista henkilö tietokannasta
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end(); // Palauta 204 No Content
    })
    .catch((error) => next(error));
});

// Virheidenkäsittely middleware
app.use((error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted ID' });
  }

  next(error);
});

// Palvelimen käynnistys
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});