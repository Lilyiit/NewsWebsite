import React from 'react';
import './WideNewsCard.css';
import defaultImage from '../../assets/default-news.jpg';
import { Link } from 'react-router-dom';

function WideNewsCard({ id, image, title, summary, author, date, ...newsItem }) {
  const validImage =
    image && image !== 'null' && image !== 'undefined' ? image : defaultImage;

  const handleImageError = (e) => {
    if (e.target.src !== defaultImage) {
      e.target.src = defaultImage;
    }
  };

  return (
    <Link
      to={`/news/${id || encodeURIComponent(title)}`}
      state={{ newsItem: { id, image, title, summary, author, date, ...newsItem } }}
      className="wide-news-card"
      style={{ cursor: 'pointer' }}
    >
      <img
        src={validImage}
        alt={title}
        className="wide-news-image"
        onError={handleImageError}
      />
      <div className="wide-news-content">
        <h3>{title}</h3>
        <p>{summary}</p>
        <span>{author} - {date}</span>
      </div>
    </Link>
  );
}

export default WideNewsCard;
