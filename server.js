const { log } = require('console');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const dataFile = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static('public'));

function readData() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

app.post('/create', (req, res) => {
  const formData = req.body;
  const records = readData();
  records.push(formData);
  writeData(records);
  res.status(201).json(formData);
});
  
app.get('/read', (req, res) => {
  const records = readData();
  res.status(200).json(records);
});

app.put('/update/:index', (req, res) => {
  const formData = req.body;
  const records = readData();
  const recordIndex = parseInt(req.params.index);
  if (recordIndex >= 0 && recordIndex < records.length) {
    records[recordIndex] = formData;
    writeData(records);
    res.status(200).json(formData);
  } else {
    res.status(400).send('Invalid index');
  }
});

app.delete('/delete/:index', (req, res) => {
  const records = readData();
  const recordIndex = parseInt(req.params.index);
  if (recordIndex >= 0 && recordIndex < records.length) {
    records.splice(recordIndex, 1);
    writeData(records);
    res.status(204).send();
  } else {
    res.status(400).send('Invalid index');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



