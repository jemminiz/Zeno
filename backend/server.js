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

// Delete a card
app.delete('/api/cards/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);

  if (index >= 0 && index < cards.length) {
    cards.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Card not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
