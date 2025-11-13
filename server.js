const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fetch Freshcaller call logs
app.get('/api/freshcaller/calls', async (req, res) => {
  try {
    const response = await axios.get('https://api.freshcaller.com/v2/calls', {
      headers: {
        Authorization: `Token token=${process.env.FRESHCALLER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Freshcaller API error:', error.message);
    res.status(500).send('Error fetching Freshcaller data');
  }
});

// Create Freshdesk ticket
app.post('/api/freshdesk/ticket', async (req, res) => {
  const { name, email, subject, description } = req.body;

  try {
    const response = await axios.post(
      `https://${process.env.FRESHDESK_DOMAIN}/api/v2/tickets`,
      {
        name,
        email,
        subject,
        description,
        priority: 1,
        status: 2
      },
      {
        auth: {
          username: process.env.FRESHDESK_API_KEY,
          password: 'X' // Freshdesk requires a dummy password
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Freshdesk API error:', error.message);
    res.status(500).send('Error creating Freshdesk ticket');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
