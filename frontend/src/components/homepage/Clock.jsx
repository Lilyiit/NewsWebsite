import React, { useEffect, useState } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // her saniye günceller
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div style={{ color: '#fff', fontSize: '1rem', marginRight: '1rem' }}>
      {formatTime(time)}
    </div>
  );
}

export default Clock;
