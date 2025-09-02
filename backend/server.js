const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory storage for cards
let cards = [];

// In-memory storage for accounts
let accounts = [];

// For generating unique account IDs
let nextAccountId = 1;

// Fetch all accounts
app.get('/api/accounts', (req, res) => {
  res.json(accounts);
});

// Add a new account
app.post('/api/accounts', (req, res) => {
  const account = req.body;
  if (!account.name) {
    return res.status(400).json({ error: 'Account name is required' });
  }
  account.id = nextAccountId++;
  accounts.push(account);
  res.status(201).json(account);
});

// Update an existing account
app.put('/api/accounts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = accounts.findIndex(acc => acc.id === id);
  if (idx !== -1) {
    const updatedAccount = req.body;
    accounts[idx] = { ...accounts[idx], ...updatedAccount };
    res.json(accounts[idx]);
  } else {
    res.status(404).json({ error: 'Account not found' });
  }
});

// Routes

// Fetch all cards
app.get('/api/cards', (req, res) => {
  res.json(cards);
});

// Add a new card
app.post('/api/cards', (req, res) => {
  const card = req.body;

  // Ensure the card has a name
  if (!card.name) {
    card.name = `New ${card.type.replace('-', ' ')}`;
  }

  // Ensure the card has a type
  if (!card.type) {
    card.type = 'default';
  }

  // Ensure the card has a color
  if (!card.color) {
    card.color = '#FFFFFF'; // Default color
  }

  // Add the card to the in-memory array
  cards.push(card);

  // Respond with the newly created card
  res.status(201).json(card);
});

// Update an existing card
app.put('/api/cards/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  console.log('PUT request received for index:', index); // Log the index
  console.log('Current cards array:', cards); // Log the current cards array

  if (index >= 0 && index < cards.length) {
    const updatedCard = req.body;

    // Merge the existing card with the updated data
    cards[index] = { ...cards[index], ...updatedCard };

    console.log('Updated cards array:', cards); // Log the updated cards array
    res.json(cards[index]);
  } else {
    console.log('Card not found at index:', index); // Log if the index is invalid
    res.status(404).json({ error: 'Card not found' });
  }
});

// Delete an account
app.delete('/api/accounts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log('Delete request for id:', id, 'Current accounts:', accounts);
  const idx = accounts.findIndex(acc => acc.id === id);
  if (idx !== -1) {
    accounts.splice(idx, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Account not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
