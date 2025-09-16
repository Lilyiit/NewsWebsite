import React, { useEffect, useState } from 'react';
import './Slider.css';
import Weather from './Weather';
import FinanceBar from './FinanceBar';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

function Slider() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchSliderNews = async () => {
      const cached = localStorage.getItem('sliderNews');

      if (cached) {
        setNewsData(JSON.parse(cached));
        return;
      }

      try {
        const res = await fetch('https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=b359202009d946c3abb282a3c9fca3b8');
        const json = await res.json();

        const mappedData = json.articles.map((item) => ({
          image: item.urlToImage,
          category: item.source.name || 'Genel',
          headline: item.title,
          summary: item.description || '',
          author: item.author || 'Bilinmeyen',
          date: new Date(item.publishedAt).toLocaleString('tr-TR')
        }));

        localStorage.setItem('sliderNews', JSON.stringify(mappedData)); // ☑️ cachele
        setNewsData(mappedData);
      } catch (error) {
        console.error('Slider haberleri alınamadı:', error);
      }
    };

    fetchSliderNews();
  }, []);

  return (
    <div className="slider-wrapper">
      <div className="slider-left">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          loop={true}
          spaceBetween={30}
          slidesPerView={1}
        >
          {newsData.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="slide-item">
                <img src={item.image} alt="manset" className="slider-image" />
                <div className="slider-content">
                  <span className="category">{item.category}</span>
                  <h2 className="headline">{item.headline}</h2>
                  <p className="summary">{item.summary}</p>
                  <p className="author">{item.author} • {item.date}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="slider-right">
        <Weather />
        <FinanceBar />
      </div>
    </div>
  );
}

export default Slider;
