const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

app.use(express.json()); // Middleware JSON-datan käsittelyyn

// Luo uusi Morgan-token POST-datan näyttämiseksi
morgan.token('body', (req) => JSON.stringify(req.body));

// Mukautettu Morgan-formaatti, joka näyttää POST-datan
const customMorganFormat = ':method :url :status :res[content-length] - :response-time ms :body';

// Ota Morgan käyttöön mukautetulla formaatilla
app.use(morgan(customMorganFormat));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Reitti, joka palauttaa kaikki henkilöt
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/', (req, res) => {
  res.json("Hello World")
})

// Reitti, joka palauttaa yksittäisen henkilön tiedot
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);

if (person) {
res.json(person);
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

// Reitti, joka poistaa henkilön
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const initialLength = persons.length;
  persons = persons.filter((p) => p.id !== id);

  if (persons.length < initialLength) {
    res.status(204).end(); // No Content
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

// Reitti, joka lisää uuden henkilön
app.post('/api/persons', (req, res) => {
  const body = req.body;

  // Tarkista, että nimi ja numero ovat mukana
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

// Tarkista, että nimi on uniikki
  if (persons.some((p) => p.name === body.name)) {
    return res.status(400).json({ error: 'Name must be unique' });
}

const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(), // Satunnainen ID
    name: body.name,
    number: body.number,
};

  persons = persons.concat(newPerson);
  res.status(201).json(newPerson); // Created
});


// Reitti, joka näyttää info-sivun
app.get('/info', (req, res) => {
  const currentTime = new Date();
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>
  `;
  res.send(info);
});

app.use(express.json()); // JSON-datan käsittely
morgan.token('body', (req) => JSON.stringify(req.body)); // Luo token POST-datalle
const CustomMorganFormat = ':method :url :status :res[content-length] - :response-time ms :body';
app.use(morgan(customMorganFormat)); // Ota käyttöön mukautettu formaatti

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 