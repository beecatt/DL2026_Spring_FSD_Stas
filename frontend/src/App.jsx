import { useEffect, useState } from 'react';
import QrForm from './components/QrForm';
import QrPreview from './components/QrPreview';
import HistoryList from './components/HistoryList';
import { saveQrCode, getQrHistory } from './services/api';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    content: '',
    size: 220,
    foreground: '#000000',
    background: '#ffffff',
  });

  const [saveStatus, setSaveStatus] = useState({
    loading: false,
    success: '',
    error: '',
  });

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError('');

      const data = await getQrHistory();
      setHistory(data);
    } catch (error) {
      setHistoryError(error.message || 'Failed to load history.');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSave = async () => {
    if (!formData.content.trim()) {
      setSaveStatus({
        loading: false,
        success: '',
        error: 'Please enter text or URL before saving.',
      });
      return;
    }

    try {
      setSaveStatus({
        loading: true,
        success: '',
        error: '',
      });

      await saveQrCode(formData);

      setSaveStatus({
        loading: false,
        success: 'QR code was successfully saved to history.',
        error: '',
      });

      await loadHistory();
    } catch (error) {
      setSaveStatus({
        loading: false,
        success: '',
        error: error.message || 'Failed to save QR code.',
      });
    }
  };

  const handleUseAgain = (item) => {
    setFormData({
      content: item.content,
      size: item.size,
      foreground: item.foreground,
      background: item.background,
    });

    setSaveStatus({
      loading: false,
      success: '',
      error: '',
    });
  };

  return (
    <div className="app">
      <div className="container">
        <header className="page-header">
          <h1>QR Studio</h1>
          <p>Create and customize QR codes in real time</p>
        </header>

        <main className="main-grid">
          <QrForm
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            saveStatus={saveStatus}
          />

          <QrPreview formData={formData} />
        </main>

        <div className="history-section">
          <HistoryList
            history={history}
            onUseAgain={handleUseAgain}
            loading={historyLoading}
            error={historyError}
          />
        </div>
      </div>
    </div>
  );
}

export default App;