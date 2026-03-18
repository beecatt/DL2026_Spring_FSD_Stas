import { QRCodeCanvas } from 'qrcode.react';

const downloadQR = () => {
    const canvas = document.getElementById("qr-code-canvas");
    const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


function QrPreview({ formData }) {
    const hasContent = formData.content.trim().length > 0;

    return (
        <section className="card preview-card">
            <h2>Preview</h2>

            <div className="preview-box">
                {hasContent ? (
                    <QRCodeCanvas
                        id="qr-code-canvas"
                        value={formData.content}
                        size={formData.size}
                        fgColor={formData.foreground}
                        bgColor={formData.background}
                    />
                ) : (
                    <div className="preview-placeholder">
                        Enter text or URL to generate a QR code
                    </div>
                )}
            </div>

            <div className="preview-meta">
                <p>
                    <strong>Content:</strong>{' '}
                    {hasContent ? formData.content : 'No content yet'}
                </p>
            </div>

            <button
                type="button"
                className="secondary-button"
                disabled={!hasContent}
                onClick={downloadQR}
            >
                Download PNG
            </button>
        </section>
    );
}


export default QrPreview;