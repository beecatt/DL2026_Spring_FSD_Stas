function QrForm({ formData, setFormData, onSave, onClearDraft, saveStatus }) {
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'size' ? Number(value) : value,
        }));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setFormData((prev) => ({
            ...prev,
            centerImageFile: file,
            centerImagePreview: previewUrl,
        }));
    };

    const removeCenterImage = () => {
        setFormData((prev) => ({
            ...prev,
            centerImageFile: null,
            centerImagePreview: '',
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

            <div className="form-group">
                <label>Center image</label>

                <div className="file-upload-row">
                    <label htmlFor="centerImage" className="file-upload-button">
                        Choose image
                    </label>

                    <span className="file-upload-name">
                        {formData.centerImageFile
                            ? formData.centerImageFile.name
                            : formData.centerImagePreview
                                ? 'Saved image from history'
                                : 'No file selected'}
                    </span>

                    <input
                        id="centerImage"
                        name="centerImage"
                        type="file"
                        accept="image/*"
                        className="file-upload-input"
                        onChange={handleImageUpload}
                    />
                </div>
            </div>

            {formData.centerImagePreview && (
                <button
                    type="button"
                    className="secondary-button remove-image-button"
                    onClick={removeCenterImage}
                >
                    Remove center image
                </button>
            )}

            <div className="form-actions">
                <button
                    type="button"
                    className="primary-button"
                    onClick={onSave}
                    disabled={saveStatus.loading}
                >
                    {saveStatus.loading ? 'Saving...' : 'Save to history'}
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onClearDraft}
                >
                    Clear draft
                </button>
            </div>

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