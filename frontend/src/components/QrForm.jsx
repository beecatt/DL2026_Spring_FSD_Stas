function QrForm({ formData, setFormData, onSave, saveStatus }) {
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'size' ? Number(value) : value,
        }));
    };

    return (
        <section className="card">
            <h2>QR Settings</h2>

            <div className="form-group">
                <label htmlFor="content">Text or URL</label>
                <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Enter text or paste a URL"
                    rows="5"
                />
            </div>

            <div className="form-group">
                <label htmlFor="size">Size: {formData.size}px</label>
                <input
                    id="size"
                    name="size"
                    type="range"
                    min="120"
                    max="400"
                    step="10"
                    value={formData.size}
                    onChange={handleChange}
                />
            </div>

            <div className="color-row">
                <div className="form-group">
                    <label htmlFor="foreground">QR color</label>
                    <input
                        id="foreground"
                        name="foreground"
                        type="color"
                        value={formData.foreground}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="background">Background</label>
                    <input
                        id="background"
                        name="background"
                        type="color"
                        value={formData.background}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <button
                type="button"
                className="primary-button"
                onClick={onSave}
                disabled={saveStatus.loading}
            >
                {saveStatus.loading ? 'Saving...' : 'Save to history'}
            </button>

            {saveStatus.success && (
                <p className="status-message success-message">{saveStatus.success}</p>
            )}

            {saveStatus.error && (
                <p className="status-message error-message">{saveStatus.error}</p>
            )}
        </section>
    );
}

export default QrForm;