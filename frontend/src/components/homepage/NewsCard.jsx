import React, { useEffect, useState } from 'react';
import './NewsCard.css';
import defaultImage from '../../assets/default-news.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function NewsCard({
  id,
  image,
  title,
  summary,
  author,
  date,
  source,
  content,
  editor,
  isCustomNews,
  tags = []
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = ['admin@yynews.com', 'admin2@yynews.com'].includes(user?.email);

  const validImage =
    image && image !== 'null' && image !== 'undefined' ? image : defaultImage;

  const handleImageError = (e) => {
    if (e.target.src !== defaultImage) {
      e.target.src = defaultImage;
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm('Bu haberi silmek istediğinize emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
        window.location.reload();
      } catch (error) {
        console.error("Silme hatası:", error);
      }
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/haber-duzenle/${id}`);
  };

  const handleCardClick = () => {
    const newsData = {
      id,
      image,
      title,
      summary,
      author,
      date,
      source,
      content,
      editor,
      isCustomNews,
      tags
    };
    localStorage.setItem("mainNews", JSON.stringify(newsData));
  };

  return (
    <Link
      to={`/news/${id}`}
      state={{
        newsItem: {
          id,
          image,
          title,
          summary,
          author,
          date,
          source,
          content,
          editor,
          isCustomNews,
          tags
        }
      }}
      onClick={handleCardClick}
      className="news-card-link"
    >
      <div className="news-card">
        {isAdmin && isCustomNews && (
          <div className="admin-actions">
            <span className="edit-icon" onClick={handleEdit}>✏️</span>
            <span className="delete-icon" onClick={handleDelete}>🗑️</span>
          </div>
        )}

        <img
          src={validImage}
          alt={title}
          className="news-image"
          onError={handleImageError}
        />

        <div className="news-content">
          <div className="news-source-tag">
            {isCustomNews
              ? (Array.isArray(tags) ? tags.join(', ') : tags)
              : source}
          </div>

          <h3 className="news-title">{title}</h3>
          <p className="news-summary">{summary}</p>
          <p className="news-author">
            <strong>Editör:</strong> {editor || author} <br />
            <span style={{ color: '#cbd5e1' }}>{date}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default NewsCard;
