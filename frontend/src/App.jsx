import { useEffect, useState } from 'react';
import QrForm from './components/QrForm';
import QrPreview from './components/QrPreview';
import HistoryList from './components/HistoryList';
import { saveQrCode, getQrHistory, deleteQrCode } from './services/api';

const FORM_STORAGE_KEY = 'qr-studio-form';

const getInitialFormData = () => {
  const saved = sessionStorage.getItem(FORM_STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        content: parsed.content || '',
        size: parsed.size || 220,
        foreground: parsed.foreground || '#000000',
        background: parsed.background || '#ffffff',
        centerImageFile: null,
        centerImagePreview: parsed.centerImagePreview || '',
      };
    } catch {
      // ignore broken session storage
    }
  }

  return {
    content: '',
    size: 220,
    foreground: '#000000',
    background: '#ffffff',
    centerImageFile: null,
    centerImagePreview: '',
  };
};

const looksLikeUrl = (value) => {
  return value.includes('.') && !value.includes(' ');
};

const isValidUrl = (value) => {
  try {
    new URL(value.startsWith('http') ? value : `https://${value}`);
    return true;
  } catch {
    return false;
  }
};

function App() {
  const [formData, setFormData] = useState(getInitialFormData);

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

  useEffect(() => {
    sessionStorage.setItem(
      FORM_STORAGE_KEY,
      JSON.stringify({
        content: formData.content,
        size: formData.size,
        foreground: formData.foreground,
        background: formData.background,
        centerImagePreview: formData.centerImagePreview,
      })
    );
  }, [
    formData.content,
    formData.size,
    formData.foreground,
    formData.background,
    formData.centerImagePreview,
  ]);

  const handleSave = async () => {
    const trimmedContent = formData.content.trim();

    if (!trimmedContent) {
      setSaveStatus({
        loading: false,
        success: '',
        error: 'Please enter text or URL before saving.',
      });
      return;
    }

    if (looksLikeUrl(trimmedContent) && !isValidUrl(trimmedContent)) {
      setSaveStatus({
        loading: false,
        success: '',
        error: 'Please enter a valid URL starting with http:// or https://',
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
      centerImageFile: null,
      centerImagePreview: item.centerImage
        ? `http://localhost:5000${item.centerImage}`
        : '',
    });

    setSaveStatus({
      loading: false,
      success: '',
      error: '',
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this QR code from history?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteQrCode(id);
      await loadHistory();
    } catch (error) {
      setHistoryError(error.message || 'Failed to delete QR code.');
    }
  };

  const handleClearDraft = () => {
    setFormData({
      content: '',
      size: 220,
      foreground: '#000000',
      background: '#ffffff',
      centerImageFile: null,
      centerImagePreview: '',
    });

    sessionStorage.removeItem(FORM_STORAGE_KEY);

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
            onClearDraft={handleClearDraft}
            saveStatus={saveStatus}
          />

          <QrPreview formData={formData} />
        </main>

        <div className="history-section">
          <HistoryList
            history={history}
            onUseAgain={handleUseAgain}
            onDelete={handleDelete}
            loading={historyLoading}
            error={historyError}
          />
        </div>
      </div>
    </div>
  );
}

export default App;