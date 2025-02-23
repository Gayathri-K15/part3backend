// index.js
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json()); // Middleware for parsing JSON requests

// Sample hardcoded phonebook entries
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Use Morgan for logging
morgan.token('body', (req) => JSON.stringify(req.body)); // Custom token for POST data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Step 3.1: Return a hardcoded list of phonebook entries
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Step 3.2: Display information about the request time and phonebook entry count
app.get('/info', (req, res) => {
  const currentTime = new Date();
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>
  `);
});

// Step 3.3: Get information for a single phonebook entry
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

// Step 3.4: Delete a phonebook entry
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

// Step 3.5: Add a new phonebook entry
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  const existingPerson = persons.find(p => p.name === name);
  if (existingPerson) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const newPerson = {
    id: (Math.random() * 1000000).toFixed(0), // Generate a random id
    name,
    number
  };

  persons.push(newPerson);
  res.status(201).json(newPerson);
});

// Step 3.6: Error handling for POST request (missing name/number or duplicate name)
app.use((req, res) => {
  res.status(404).send({ error: 'Not found' });
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
