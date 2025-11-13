const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// CSV upload and parse route
app.post('/upload', upload.single('file'), (req, res) => {
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log('CSV parsed:', results);
      fs.unlinkSync(filePath); // Clean up uploaded file
      res.json({ message: 'File uploaded and parsed successfully', data: results });
    })
    .on('error', (err) => {
      console.error('CSV parsing error:', err);
      res.status(500).send('Error parsing CSV');
    });
});

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
