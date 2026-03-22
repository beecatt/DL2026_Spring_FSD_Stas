import { QRCodeCanvas } from 'qrcode.react';

function QrPreview({ formData }) {
    const hasContent = formData.content.trim().length > 0;

    const downloadQR = () => {
        const qrCanvas = document.getElementById('qr-code-canvas');

        if (!qrCanvas) {
            return;
        }

        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');

        finalCanvas.width = qrCanvas.width;
        finalCanvas.height = qrCanvas.height;

        ctx.drawImage(qrCanvas, 0, 0);

        if (formData.centerImagePreview) {
            const image = new Image();

            image.crossOrigin = 'anonymous';

            image.onload = () => {
                const logoSize = finalCanvas.width * 0.22;
                const x = (finalCanvas.width - logoSize) / 2;
                const y = (finalCanvas.height - logoSize) / 2;
                const padding = 8;

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(
                    x - padding,
                    y - padding,
                    logoSize + padding * 2,
                    logoSize + padding * 2
                );

                ctx.drawImage(image, x, y, logoSize, logoSize);

                const pngUrl = finalCanvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = pngUrl;
                link.download = 'qr-code.png';
                link.click();
            };

            image.src = formData.centerImagePreview;
            return;
        }

        const pngUrl = finalCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'qr-code.png';
        link.click();
    };

    return (
        <section className="card preview-card">
            <h2>Preview</h2>

            <div className="preview-box">
                {hasContent ? (
                    <div
                        className="qr-wrapper"
                        style={{
                            width: `${formData.size}px`,
                            height: `${formData.size}px`,
                        }}
                    >
                        <QRCodeCanvas
                            id="qr-code-canvas"
                            value={formData.content}
                            size={formData.size}
                            fgColor={formData.foreground}
                            bgColor={formData.background}
                            includeMargin={true}
                            level="H"
                        />

                        {formData.centerImagePreview && (
                            <div className="center-image-overlay">
                                <img src={formData.centerImagePreview} alt="Center logo" />
                            </div>
                        )}
                    </div>
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