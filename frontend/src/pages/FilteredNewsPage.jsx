import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import NewsCard from '../components/homepage/NewsCard';
import './FilteredNewsPage.css'; // ✅ CSS dosyası

function FilteredNewsPage() {
  const location = useLocation();
  const [taggedNews, setTaggedNews] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const tag = queryParams.get('tag')?.toLowerCase(); // Küçük harfe çevir

  useEffect(() => {
    if (!tag) return;

    const cacheKey = `tag-news-${tag}`; // Küçük harfli cache key
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      setTaggedNews(JSON.parse(cachedData));
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'news'), (snapshot) => {
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(news => 
          Array.isArray(news.tags) && 
          news.tags.map(t => t.toLowerCase()).includes(tag) // Küçük harfe duyarlı filtre
        );

      setTaggedNews(filtered);
      localStorage.setItem(cacheKey, JSON.stringify(filtered)); // Cache güncelle
    });

    return () => unsubscribe();
  }, [tag]);

  return (
    <div className="news-section-container">
      <h2 className="section-title">{tag} Haberleri</h2>
      <div className="news-grid">
        {taggedNews.length > 0 ? (
          taggedNews.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.title}
              summary={item.summary}
              image={item.imageUrl} // Doğru alanı kullanıyorsun
              author={item.author}
              editor={item.editor}
              date={item.date}
              source={item.source}
              content={item.content}
              tags={item.tags}
              isCustomNews={true}
            />
          ))
        ) : (
          <p className="no-news-text">Bu etikete ait haber bulunamadı.</p>
        )}
      </div>
    </div>
  );
}

export default FilteredNewsPage;
