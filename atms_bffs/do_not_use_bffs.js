const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const API_ENDPOINT = 'http://localhost:5000'; // Your API endpoint here

app.use(express.json());


// upload dataset
app.post('/api/datasets', async (req, res) => {
  try {
    const { class_column, train_path } = req.body;

    // Forward the request to the actual API endpoint
    const response = await axios.post(`${API_ENDPOINT}/api/datasets`, {
      class_column,
      train_path
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET endpoint for /api/datasets get all datasets
app.get('/api/datasets', async (req, res) => {
  try {
    // Forward the request to the actual API endpoint
    const response = await axios.get(`${API_ENDPOINT}/api/datasets`);

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET endpoint for /api/datasets/:id
app.get('/api/datasets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Forward the request to the actual API endpoint
    const response = await axios.get(`${API_ENDPOINT}/api/datasets/${id}`);

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST endpoint for /api/run create data run
app.post('/api/run', async (req, res) => {
  try {
    const { dataset_id } = req.body;

    // Forward the request to the actual API endpoint
    const response = await axios.post(`${API_ENDPOINT}/api/run`, {
      dataset_id
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET endpoint for /api/datasets/:id/dataruns
app.get('/api/datasets/:id/dataruns', async (req, res) => {
  try {
    const { id } = req.params;

    // Forward the request to the actual API endpoint
    const response = await axios.get(`${API_ENDPOINT}/api/datasets/${id}/dataruns`);

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});