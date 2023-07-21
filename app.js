const express = require('express');
const axios = require('axios');

const app = express();
const port = 8080;

const fetchDataWithTimeout = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 500 });
    return response.data.numbers || [];
  } catch (error) {
    console.log(`Error fetching data from ${url}:`, error.message);
    return [];
  }
};

app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url || !Array.isArray(url)) {
    return res.status(400).json({ error: 'Invalid URL parameter. Please provide valid URLs.' });
  }

  try {
    const uniqueNumbers = new Set();

    const promises = url.map((u) => fetchDataWithTimeout(u));
    const results = await Promise.all(promises);

    results.forEach((numbers) => {
      numbers.forEach((number) => uniqueNumbers.add(number));
    });

    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);

    return res.json({ numbers: sortedNumbers });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
