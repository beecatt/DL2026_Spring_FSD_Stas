const API_BASE_URL = 'http://localhost:5000/api';

export async function saveQrCode(data) {
    const response = await fetch(`${API_BASE_URL}/qr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save QR code');
    }

    return response.json();
}

export async function getQrHistory() {
    const response = await fetch(`${API_BASE_URL}/qr`);

    if (!response.ok) {
        throw new Error('Failed to load QR history');
    }

    return response.json();
}