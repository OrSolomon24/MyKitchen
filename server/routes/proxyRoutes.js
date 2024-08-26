// routes/proxyRoutes.js

const express = require('express');
const request = require('request');
const router = express.Router();

router.get('/proxy', (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  request(
    { url: targetUrl, method: 'GET' },
    (error, response, body) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to fetch the URL' });
      }

      res.set('Content-Type', response.headers['content-type']);
      res.send(body);
    }
  );
});

module.exports = router;
