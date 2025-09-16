import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './AddNews.css';

function AddNews() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [editor, setEditor] = useState('');
  const [success, setSuccess] = useState(false);

  // ✅ Tag seçimi için state
  const [selectedTags, setSelectedTags] = useState([]);
  const availableTags = [
    'ai', 'mobile', 'gadget',
    'politics', 'economy',
    'nutrition', 'mental', 'fitness',
    'football', 'basketball', 'esports',
    'space', 'environment', 'plants'
  ];

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    const allowedAdmins = ['admin@yynews.com', 'admin2@yynews.com'];
    if (!user || !allowedAdmins.includes(user.email)) {
      navigate('/');
    }
  });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedTags.length === 0) {
      alert("Lütfen en az bir tag seçin.");
      return;
    }

    try {
      await addDoc(collection(db, 'news'), {
        title,
        content,
        imageUrl,
        date,
        editor,
        tags: selectedTags,
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setTitle('');
      setContent('');
      setImageUrl('');
      setDate('');
      setEditor('');
      setSelectedTags([]);
    } catch (error) {
      console.error('Haber eklenirken bir hata oluştu:', error);
    }
  };

  return (
    <div className="add-news-container">
      <h2>Yeni Haber Ekle</h2>
      <form onSubmit={handleSubmit} className="add-news-form">
        <input
          type="text"
          placeholder="Haber Başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Haber İçeriği"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>

        <input
          type="text"
          placeholder="Görsel URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tarih (örn: 07 Mayıs 2025)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Editör İsmi"
          value={editor}
          onChange={(e) => setEditor(e.target.value)}
          required
        />

        {/* ✅ TAG SEÇİM ALANI */}
        <div className="tag-selector">
          <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Etiket Seç (en az 1):</p>
          <div className="tag-button-group">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  );
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">Haberi Ekle</button>

        {success && <p className="success-message">Haber başarıyla eklendi!</p>}
      </form>
    </div>
  );
}

export default AddNews;
