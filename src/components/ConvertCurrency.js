import React, { useState } from 'react';
import axios from 'axios';
import '../styles/style.css';

function ConvertCurrency() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [result, setResult] = useState('');
  const [calculations, setCalculations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://127.0.0.1:5001/convert', {
        params: { base: fromCurrency, final: toCurrency, amount },
      });
      if (response.status === 200 && response.data.converted_amount) {
        const convertedAmount = parseFloat(response.data.converted_amount).toFixed(2);
        const calculation = {
          amount,
          fromCurrency,
          toCurrency,
          result: convertedAmount,
        };
        setCalculations([calculation, ...calculations]); // Add new calculation to the top
        setResult(`${amount} ${fromCurrency} is equivalent to ${convertedAmount} ${toCurrency}`);
      } else {
        setResult('Error occurred during currency conversion.');
      }
    } catch (error) {
      console.error('Error converting currency:', error);
      setResult('Failed to convert currency');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Convert Currency</h2>
        <p>Enter the amount and select the currencies to convert:</p>
        <form onSubmit={handleSubmit}>
          <label>Amount</label>
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <label>From Currency</label>
          <input type="text" placeholder="From Currency" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} required />
          <label>To Currency</label>
          <input type="text" placeholder="To Currency" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} required />
          <button type="submit">Convert</button>
        </form>
        {result && <p>{result}</p>}
      </div>
      <div className="table-container">
        <h2>Completed Calculations</h2>
        {calculations.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>From Currency</th>
                <th>To Currency</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {calculations.map((calc, index) => (
                <tr key={index}>
                  <td>{calc.amount}</td>
                  <td>{calc.fromCurrency}</td>
                  <td>{calc.toCurrency}</td>
                  <td>{calc.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No calculations completed yet.</p>
        )}
      </div>
    </div>
  );
}

export default ConvertCurrency;
