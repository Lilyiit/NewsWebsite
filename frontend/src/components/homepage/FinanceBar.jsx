import React, { useEffect, useState } from 'react';
import './FinanceBar.css';

function FinanceBar() {
  const [rates, setRates] = useState(null);
  const [prevRates, setPrevRates] = useState(null);

  const currencies = [
    { name: 'US Dollar $', from: 'USD' },
    { name: 'Euro €', from: 'EUR' },
    { name: 'British Pound £', from: 'GBP' },
    { name: '	Canadian Dollar $', from: 'CAD' },
    { name: '	Japanese Yen ¥', from: 'JPY' },
    { name: '	Swiss Franc CHF', from: 'CHF' }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const promises = currencies.map(currency =>
          fetch(`https://api.frankfurter.app/latest?from=${currency.from}&to=TRY`)
            .then(res => res.json())
            .then(data => ({ [currency.name]: data.rates.TRY }))
        );

        const results = await Promise.all(promises);
        const newRates = Object.assign({}, ...results);

        setPrevRates(rates); // önceki oranları sakla
        setRates(newRates);
      } catch (error) {
        console.error('Veri alınamadı:', error);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000); // 1 dakikada bir yenile
    return () => clearInterval(interval);
  }, [rates]);

  return (
    <div className="finance-card">
      <h4 className="title">Exchange Rates</h4>
      {rates ? (
        <ul className="rate-list">
          {Object.entries(rates).map(([key, value]) => {
            const prev = prevRates?.[key];
            let status = '';
            if (prev !== undefined) {
              if (value > prev) status = 'up';
              else if (value < prev) status = 'down';
              else status = 'same';
            }

            return (
              <li key={key}>
                <span className="label">{key}</span>
                <span className={`value ${status}`}>
                  {value.toFixed(2)} ₺
                  {status === 'down' && prev !== undefined && (
                    <span className="prev-value"> ({prev.toFixed(2)} ₺)</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
}

export default FinanceBar;
