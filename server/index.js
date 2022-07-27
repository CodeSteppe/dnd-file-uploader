const path = require('path');
const express = require('express');
const cors = require('cors')
const multer = require('multer')

const app = express();
const port = 3000;
const uploadsPath = path.resolve(__dirname, './uploads');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadsPath);
  },
  filename: function (req, file, callback) {
    const filename = req.headers['x-file-name'];
    callback(null, `${Date.now()}-${decodeURIComponent(filename)}`);
    return;
  }
})
const upload = multer({ storage });

app.use(cors())

app.post('/upload', upload.single('file'), (req, res) => {
  console.log('req', req.file);
  res.json({ url: `http://localhost:3000/uploads/${req.file.filename}` })
});

app.use('/uploads', express.static(uploadsPath));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});