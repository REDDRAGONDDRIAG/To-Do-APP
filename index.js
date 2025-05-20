const express = require('express');
const cors = require('cors');
const taskRoutes = require('./backend/routes/tasks');
const app = express();
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
console.log(`Port: ${PORT}`);
// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.send('Witaj w aplikaji Node.js!');
  });
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.removeHeader("Cross-Origin-Opener-Policy");

  next();
});
// Routes
app.use('/api/tasks', taskRoutes);
// Server start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

