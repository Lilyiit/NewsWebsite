import React from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';

import TopNav from './components/homepage/TopNav';
import NewsSection from './components/homepage/NewsSection';
import Footer from './components/homepage/Footer';
import Slider from './components/homepage/Slider';
import Login from './components/SignUp-Logİn/Login';
import Register from './components/SignUp-Logİn/Register';
import NewsPage from './components/news/NewsPage';
import AddNews from './pages/AddNews';
import EditNews from './pages/EditNews';
import FilteredNewsPage from './pages/FilteredNewsPage'; // ✅ YENİ EKLENDİ
import ModerationPanel from './pages/ModerationPanel'; // ✅ EKLENDİ

function HomePage() {
  return (
    <div className="container">
      <Slider />
      <NewsSection />
      <Footer />
    </div>
  );
}

function App() {
  const location = useLocation();
  const hideNavPaths = ['/login', '/register'];

  return (
    <div className="App">
      {!hideNavPaths.includes(location.pathname) && <TopNav />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/news/:id" element={<NewsPage />} />
        <Route path="/admin/add-news" element={<AddNews />} />
        <Route path="/haber-duzenle/:id" element={<EditNews />} />
        <Route path="/tags" element={<FilteredNewsPage />} />
        <Route path="/admin/moderation" element={<ModerationPanel />} /> {/* ✅ MODERATION PANEL EKLENDİ */}
      </Routes>
    </div>
  );
}

export default App;