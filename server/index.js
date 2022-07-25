const path = require('path');
const express = require('express');
const cors = require('cors')
const multer = require('multer')

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.resolve(__dirname, './uploads'));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
})
const upload = multer({ storage });

app.use(cors())

app.post('/upload', upload.single('file'), (req, res) => {
  console.log('req', req.file);
  res.json({ status: 'ok' })
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});