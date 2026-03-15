const express = require('express');
const prisma = require('../lib/prisma');

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

router.post('/', async (req, res) => {
    try {
        const { content, size, foreground, background } = req.body;

        if (!content || typeof content !== 'string' || !content.trim()) {
            return res.status(400).json({ error: 'Content is required' });
        }

        if (!size || typeof size !== 'number') {
            return res.status(400).json({ error: 'Size must be a number' });
        }

        if (!foreground || typeof foreground !== 'string') {
            return res.status(400).json({ error: 'Foreground color is required' });
        }

        if (!background || typeof background !== 'string') {
            return res.status(400).json({ error: 'Background color is required' });
        }

        const newQrCode = await prisma.qrCode.create({
            data: {
                content: content.trim(),
                size,
                foreground,
                background,
            },
        });

        res.status(201).json(newQrCode);
    } catch (error) {
        console.error('Error creating QR code:', error);
        res.status(500).json({ error: 'Failed to create QR code' });
    }
});

module.exports = router;