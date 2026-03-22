const express = require('express');
const cors = require('cors');
const path = require('path');
const qrRoutes = require('./routes/qrRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.json({ message: 'QR Studio API is running' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/qr', qrRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    if (err.message === 'Only image files are allowed') {
        return res.status(400).json({ error: err.message });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image is too large. Max size is 3 MB.' });
    }

    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});