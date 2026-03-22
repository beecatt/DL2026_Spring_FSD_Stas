const API_BASE_URL = 'http://localhost:5000/api';

export async function saveQrCode(data) {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('size', String(data.size));
    formData.append('foreground', data.foreground);
    formData.append('background', data.background);

    if (data.centerImageFile) {
        formData.append('centerImage', data.centerImageFile);
    }

    const response = await fetch(`${API_BASE_URL}/qr`, {
        method: 'POST',
        body: formData,
    });

    const text = await response.text();

    let parsedData = null;
    try {
        parsedData = text ? JSON.parse(text) : null;
    } catch {
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 120)}`);
    }

    if (!response.ok) {
        throw new Error(parsedData?.error || 'Failed to save QR code');
    }

    return parsedData;
}

export async function getQrHistory() {
    const response = await fetch(`${API_BASE_URL}/qr`);
    const text = await response.text();

    let parsedData = null;
    try {
        parsedData = text ? JSON.parse(text) : null;
    } catch {
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 120)}`);
    }

    if (!response.ok) {
        throw new Error(parsedData?.error || 'Failed to load QR history');
    }

    return parsedData;
}

export async function deleteQrCode(id) {
    const response = await fetch(`${API_BASE_URL}/qr/${id}`, {
        method: 'DELETE',
    });

    const text = await response.text();

    let parsedData = null;
    try {
        parsedData = text ? JSON.parse(text) : null;
    } catch {
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 120)}`);
    }

    if (!response.ok) {
        throw new Error(parsedData?.error || 'Failed to delete QR code');
    }

    return parsedData;
}