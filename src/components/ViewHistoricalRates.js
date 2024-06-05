import React, { useState } from 'react';
import axios from 'axios';
import '../styles/style.css';

function ViewHistoricalRates() {
  const [date, setDate] = useState('');
  const [currency, setCurrency] = useState('');
  const [rates, setRates] = useState(null);
  const [optInEmail, setOptInEmail] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.get('http://127.0.0.1:5002/historical_rates', {
      params: { date, base_currency: currency },
    });
    if (response.status === 200 && response.data) {
      setRates(response.data);

      if (optInEmail) {
        try {
          await axios.post('http://127.0.0.1:5003/send_historical_rates_email', {
            email,
            date,
            currency,
            rates: response.data,
          });
          alert('Email alert sent successfully!');
        } catch (error) {
          console.error('Error sending email:', error);
          alert('Failed to send email alert');
        }
      }
    } else {
      setRates(null);
    }
  };

  return (
    <div className="historical-rates-container">
      <div className="historical-rates-form">
        <h2>View Historical Rates</h2>
        <p>Enter the date and currency to view historical exchange rates:</p>
        <form onSubmit={handleSubmit}>
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <label>Currency</label>
          <input type="text" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
          <div>
            <label>
              <input type="checkbox" checked={optInEmail} onChange={(e) => setOptInEmail(e.target.checked)} />
              Receive email alerts
            </label>
            {optInEmail && (
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            )}
          </div>
          <button type="submit">View Rates</button>
        </form>
      </div>
      <div className="historical-rates-table">
        {rates && (
          <div>
            <h3>Rates for {currency} on {date}:</h3>
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(rates).map((curr) => (
                  <tr key={curr}>
                    <td>{curr}</td>
                    <td>{rates[curr].value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewHistoricalRates;
