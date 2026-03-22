function HistoryList({ history, onUseAgain, onDelete, loading, error }) {
    return (
        <section className="card history-card">
            <h2>History</h2>

            {loading && <p>Loading history...</p>}

            {error && <p className="status-message error-message">{error}</p>}

            {!loading && !error && history.length === 0 && (
                <p>No saved QR codes yet.</p>
            )}

            {!loading && !error && history.length > 0 && (
                <div className="history-list">
                    {history.map((item) => (
                        <article key={item.id} className="history-item">
                            <div className="history-item-content">
                                <p className="history-item-text">
                                    <strong>Content:</strong> {item.content}
                                </p>
                                <p className="history-item-meta">
                                    Size: {item.size}px
                                </p>
                                <p className="history-item-meta">
                                    QR: {item.foreground} | Background: {item.background}
                                </p>
                                <p className="history-item-meta">
                                    Center image: {item.centerImage ? 'Yes' : 'No'}
                                </p>
                            </div>

                            <div className="history-item-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => onUseAgain(item)}
                                >
                                    Use again
                                </button>

                                <button
                                    type="button"
                                    className="danger-button"
                                    onClick={() => onDelete(item.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default HistoryList;