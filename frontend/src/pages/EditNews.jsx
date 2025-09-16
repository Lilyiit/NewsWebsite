import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './AddNews.css';

function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [editor, setEditor] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ Admin koruması
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    const allowedAdmins = ['admin@yynews.com', 'admin2@yynews.com'];
    if (!user || !allowedAdmins.includes(user.email)) {
      navigate('/');
    }
  });

    return () => unsubscribe();
  }, [navigate]);

  // 🔍 Haberi Firestore'dan al
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const docRef = doc(db, 'news', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setContent(data.content);
          setImageUrl(data.imageUrl || '');
          setDate(data.date || '');
          setEditor(data.editor || '');
        } else {
          console.log("Belirtilen ID ile haber bulunamadı.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Haber alınırken hata:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  // 💾 Güncelle
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'news', id), {
        title,
        content,
        imageUrl,
        date,
        editor
      });
      navigate('/');
    } catch (error) {
      console.error("Haber güncellenirken hata oluştu:", error);
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="add-news-container">
      <h2>Haberi Düzenle</h2>
      <form onSubmit={handleUpdate} className="add-news-form">
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
          placeholder="Editör Adı"
          value={editor}
          onChange={(e) => setEditor(e.target.value)}
        />
        <button type="submit">Güncelle</button>
      </form>
    </div>
  );
}

export default EditNews;
