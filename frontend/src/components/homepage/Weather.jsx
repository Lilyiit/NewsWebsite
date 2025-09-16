import React, { useEffect, useState } from 'react';
import './Weather.css';

const Weather = () => {
  const [forecast, setForecast] = useState([]);

  const apiKey = 'd469a7ed41f7c3d7cc757bf213a09a58'; // ← Buraya kendi API anahtarını ekle
  const lat = '41.0082';
  const lon = '28.9784';

  useEffect(() => {
    const fetchWeather = async () => {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
      const data = await res.json();

      const noonForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

      const gunler = ['Sun', 'Mon', '	Tue', '	Wed', 'Thu', 'Fri', 'Sat'];

      const formatted = noonForecasts.map(item => {
        const tarih = new Date(item.dt_txt);
        const gün = gunler[tarih.getDay()];
        return {
          gün,
          derece: Math.round(item.main.temp),
          ikon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          açıklama: item.weather[0].description
        };
      });

      setForecast(formatted);
    };

    fetchWeather();
  }, []);

  return (
    <div className="weather-card">
      <h4 className="title">Weather</h4>
      <p className="city">İstanbul, İST</p>

      {forecast.length > 0 && (
        <>
          <div className="current">
            <img src={forecast[0].ikon} alt="ikon" />
            <div className="info">
              <p className="temp">{forecast[0].derece}°C</p>
              <p className="desc">{forecast[0].açıklama}</p>
            </div>
          </div>

          <div className="forecast">
            {forecast.map((day, index) => (
              <div className="day" key={index}>
                <p>{day.gün}</p>
                <img src={day.ikon} alt="ikon" />
                <p>{day.derece}°</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
