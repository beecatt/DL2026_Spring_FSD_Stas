const express = require('express');
const prisma = require('../lib/prisma');
const upload = require('../lib/upload');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const qrCodes = await prisma.qrCode.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(qrCodes);
    } catch (error) {
        console.error('Error fetching QR codes:', error);
        res.status(500).json({ error: 'Failed to fetch QR codes' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const qrCode = await prisma.qrCode.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!qrCode) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        res.json(qrCode);
    } catch (error) {
        console.error('Error fetching QR code:', error);
        res.status(500).json({ error: 'Failed to fetch QR code' });
    }
});

router.post('/', upload.single('centerImage'), async (req, res) => {
    try {
        const { content, size, foreground, background } = req.body;

        if (!content || typeof content !== 'string' || !content.trim()) {
            return res.status(400).json({ error: 'Content is required' });
        }

        if (!size || Number.isNaN(Number(size))) {
            return res.status(400).json({ error: 'Size must be a number' });
        }

        if (!foreground || typeof foreground !== 'string') {
            return res.status(400).json({ error: 'Foreground color is required' });
        }

        if (!background || typeof background !== 'string') {
            return res.status(400).json({ error: 'Background color is required' });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newQrCode = await prisma.qrCode.create({
            data: {
                content: content.trim(),
                size: Number(size),
                foreground,
                background,
                centerImage: imagePath,
            },
        });

        res.status(201).json(newQrCode);
    } catch (error) {
        console.error('Error creating QR code:', error);
        res.status(500).json({ error: 'Failed to create QR code' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const qrCode = await prisma.qrCode.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!qrCode) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        await prisma.qrCode.delete({
            where: {
                id: req.params.id,
            },
        });

        res.json({ message: 'QR code deleted successfully' });
    } catch (error) {
        console.error('Error deleting QR code:', error);
        res.status(500).json({ error: 'Failed to delete QR code' });
    }
});

module.exports = router;