import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './NewsPage.css';
import defaultImage from '../../assets/default-news.jpg';
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';

function NewsPage() {
  const { id } = useParams();
  const location = useLocation();
  const storedNews = JSON.parse(localStorage.getItem("mainNews")) || null;

  const news =
    location.state?.newsItem ||
    (storedNews && String(storedNews.id) === String(id) ? storedNews : null);

  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editorNews, setEditorNews] = useState([]);
  const [expandedContent, setExpandedContent] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (news?.title) {
      const q = query(
        collection(db, 'comments'),
        where('newsTitle', '==', news.title)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const commentList = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        setComments(commentList);
      });

      return () => unsubscribe();
    }
  }, [news?.title]);

  useEffect(() => {
    const q = query(collection(db, 'news'), where('editor', '!=', ''));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEditorNews(fetched.slice(0, 2));
    });

    return () => unsubscribe();
  }, []);

  // ✅ AI içerik cache sistemi
  useEffect(() => {
    if (!news?.title) return;

    const cacheKey = `detail-${news.title}`;
    const cachedContent = localStorage.getItem(cacheKey);

    if (cachedContent) {
      setExpandedContent(cachedContent);
    } else {
      // ✳️ Gelecekte GPT ile uzatma kullanılacaksa buraya AI çağrısı yapılabilir
      const contentToUse = news.content || news.summary || 'İçerik bulunamadı.';
      localStorage.setItem(cacheKey, contentToUse);
      setExpandedContent(contentToUse);
    }
  }, [news]);

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !user) return;

    const payload = {
      newsTitle: news.title,
      text: comment,
      email: user.email,
      username: user.displayName || 'Kullanıcı',
      avatar: user.photoURL || '/default-avatar.png',
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('https://lilyiit.app.n8n.cloud/webhook/check-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      setComment('');
    } catch (error) {
      console.error('Yorum gönderme hatası:', error);
    }
  };

  if (!news) {
    return <p>Haber verisi bulunamadı. Lütfen ana sayfadan tekrar deneyin.</p>;
  }

  const validImage =
    news.image && news.image !== 'null' && news.image !== 'undefined'
      ? news.image
      : defaultImage;

  return (
    <div className="news-page-container">
      <div className="news-content-wrapper">
        <div className="main-news-content">
          <img src={validImage} alt={news.title} className="detail-news-image" />
          <h1 className="news-title">{news.title}</h1>

          <p className="news-description">
            {expandedContent}
          </p>

          <p className="news-meta-author">
            <strong>Editör:</strong> {news.editor || news.author || 'Bilinmeyen'}
          </p>

          {news.date && (
            <p className="news-meta-date">
              Yayın Tarihi: {news.date}
            </p>
          )}

          {/* Yorum Bölümü */}
          <div className="comments-section">
            <h3 className="comments-title">Yorumlar</h3>

            {user ? (
              <div className="comment-form">
                <textarea
                  className="comment-input"
                  placeholder="Yorumunuzu yazın..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={handleCommentSubmit} className="comment-button">Gönder</button>
              </div>
            ) : (
              <div className="comment-form">
                <textarea className="comment-input" placeholder="Yorum yapabilmek için giriş yapmalısınız." disabled />
              </div>
            )}

            <div className="comment-list">
              {comments.map((c) => (
                <div key={c.id} className="comment-item-with-avatar">
                  <img
                    src={c.avatar || '/default-avatar.png'}
                    alt="avatar"
                    className="comment-avatar"
                  />
                  <div>
                    <div className="comment-user">{c.username || c.email}:</div>
                    <div className="comment-text">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="other-news-sidebar">
          <h3>Diğer Haberler</h3>
          <ul className="other-news-list">
            {storedNews && String(storedNews.id) !== String(news.id) && (
              <li className="other-news-item">
                <Link
                  to={`/news/${storedNews.id}`}
                  state={{ newsItem: storedNews }}
                  onClick={() => localStorage.setItem("mainNews", JSON.stringify(storedNews))}
                  className="other-news-link"
                >
                  <div className="other-news-card">
                    <img src={
                      storedNews.image && storedNews.image !== 'null' && storedNews.image !== 'undefined'
                        ? storedNews.image
                        : defaultImage
                    } alt={storedNews.title} className="other-news-image" />
                    <div className="other-news-title">{storedNews.title}</div>
                  </div>
                </Link>
              </li>
            )}

            {editorNews.map((item, idx) => {
              const image = item.image && item.image !== 'null' && item.image !== 'undefined'
                ? item.image
                : defaultImage;

              return (
                <li key={`editor-${idx}`} className="other-news-item">
                  <Link
                    to={`/news/${item.id}`}
                    state={{ newsItem: item }}
                    onClick={() => localStorage.setItem("mainNews", JSON.stringify(item))}
                    className="other-news-link"
                  >
                    <div className="other-news-card">
                      <img src={image} alt={item.title} className="other-news-image" />
                      <div className="other-news-title">{item.title}</div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
