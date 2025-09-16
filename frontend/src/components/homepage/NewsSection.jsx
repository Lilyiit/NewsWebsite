import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from './NewsCard';
import WideNewsCard from './WideNewsCard';
import './NewsSection.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

// ✅ AI destekli kısa içerik üretici (10 kelimelik versiyon)
const getImprovedContentWithAI = async (title) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer`, // API anahtarını buraya yaz
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a journalist. Based on the title, write a short news summary of about 100 words. Make it sound like a real headline or teaser.",
          },
          {
            role: "user",
            content: `Title: "${title}"\n\nWrite the short summary:`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API error:", error);
    return null;
  }
};


function NewsSection() {
  const [mainNews, setMainNews] = useState([]);
  const [middleCard, setMiddleCard] = useState(null);
  const [bottomLeft, setBottomLeft] = useState(null);
  const [adminNews, setAdminNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      // 🔒 Eğer AI içerikleri daha önce kaydedildiyse tekrar GPT çağrısı yapma
      const cachedNews = localStorage.getItem("aiNews");
      if (cachedNews) {
        const parsed = JSON.parse(cachedNews);
        setMainNews(parsed.slice(0, 12));
        setMiddleCard({ ...parsed[12], id: `api-12` });
        setBottomLeft({ ...parsed[13], id: `api-13` });
        return;
      }

      // 🚀 İlk kez çalışıyorsa GNews + AI kullan
      try {
        const res = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            apiKey: 'b359202009d946c3abb282a3c9fca3b8',
            country: 'us',
            pageSize: 20
          }
        });

        const data = await Promise.all(
          res.data.articles.map(async (item, index) => {
            const aiContent = await getImprovedContentWithAI(item.title);

            return {
              id: `api-${index}`,
              title: item.title,
              summary: item.description || '',
              image: item.urlToImage,
              author: item.author || 'Bilinmeyen',
              date: new Date(item.publishedAt).toLocaleString('tr-TR'),
              source: item.source.name || 'Genel',
              url: item.url,
              content: aiContent || item.content || item.description || 'No content available.',
            };
          })
        );

        // 📦 Cache'e kaydet
        localStorage.setItem("aiNews", JSON.stringify(data));

        // ⬇ Ekrana yükle
        setMainNews(data.slice(0, 12));
        setMiddleCard({ ...data[12], id: `api-12` });
        setBottomLeft({ ...data[13], id: `api-13` });

      } catch (err) {
        console.error("Haber çekme hatası:", err);
      }
    };

    const fetchAdminNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        const adminData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            image: data.imageUrl || '',
            summary: data.summary || data.content?.slice(0, 200) || '',
            isCustomNews: true
          };
        });
        setAdminNews(adminData);
      } catch (error) {
        console.error('Admin haberleri çekme hatası:', error);
      }
    };

    fetchNews();
    fetchAdminNews();
  }, []);

  return (
    <div className="news-section">
      <h2 className="section-title">Current News</h2>

      <div className="news-grid">
        {mainNews.map((item, idx) => (
          <NewsCard key={item.id || idx} {...item} isCustomNews={false} />
        ))}
      </div>

      {middleCard && (
        <div className="middle-wide-wrapper">
          <WideNewsCard {...middleCard} />
        </div>
      )}

      <div className="bottom-flex-row">
        {bottomLeft && (
          <div className="bottom-big-card">
            <WideNewsCard {...bottomLeft} />
          </div>
        )}
      </div>

      {adminNews.length > 0 && (
        <>
          <h2 className="section-title">News From Our Editors</h2>
          <div className="news-grid">
            {adminNews.map((item, idx) => (
              <NewsCard key={`admin-${item.id}`} {...item} isCustomNews={true} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default NewsSection;
