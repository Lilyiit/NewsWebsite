import React, { useState, useEffect } from 'react';
import './CategoryFilter.css';

function CategoryFilter({ onSelectCategory, articles }) {
  const [selected, setSelected] = useState('All');
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    if (articles && articles.length > 0) {
      const unique = Array.from(new Set(articles.map(article => article.category)));
      setAvailableCategories(['All', ...unique]);
    }
  }, [articles]);

  const handleClick = (category) => {
    setSelected(category);
    onSelectCategory(category);
  };

  return (
    <div className="category-filter">
      {availableCategories.map((cat) => (
        <button
          key={cat}
          className={selected === cat ? 'active' : ''}
          onClick={() => handleClick(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
