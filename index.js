const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls) {
    return res.status(400).json({ error: 'Please provide at least one URL.' });
  }

  const urlsArray = Array.isArray(urls) ? urls : [urls];
  // We can store all numbers from the URLs
  const allNumbers = []; 

  try {
    const axiosPromises = urlsArray.map(async (url) => {
      try {
        const response = await axios.get(url, { timeout: 500 });
        const numbers = response.data.numbers;

        // Add numbers to the allNumbers array
        allNumbers.push(...numbers);
      } catch (error) {
        console.error(`Error fetching URL ${url}: ${error.message}`);
      }
    });

    await Promise.all(axiosPromises);

    // It is used to remove duplicate numbers and sort
    const uniqueSortedNumbers = [...new Set(allNumbers)].sort((a, b) => a - b);

    res.json({ numbers: uniqueSortedNumbers });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching and processing the URLs.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
