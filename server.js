const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const replicaApp =  process.env.APP_NAME;

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
  console.log(`🚀 Serving by ${replicaApp} application`);
});

// Handle 404 for missing routes by serving index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ${replicaApp} Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${__dirname}`);
});

module.exports = app;
