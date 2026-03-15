const express = require('express');
const cors = require('cors');
const qrRoutes = require('./routes/qrRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'QR Studio API is running' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/qr', qrRoutes);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});