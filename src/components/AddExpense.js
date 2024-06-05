import React, { useState } from 'react';
import axios from 'axios';
import '../styles/style.css';

function AddExpense() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('');
  const [optInEmail, setOptInEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = {
      amount,
      category,
      description,
      currency,
      email: optInEmail ? email : null,
    };
    try {
      const response = await axios.post('http://127.0.0.1:5000/add_expense', newExpense);
      setMessage(response.data.message);
      setAmount('');
      setCategory('');
      setDescription('');
      setCurrency('');
      setOptInEmail(false);
      setEmail('');
    } catch (error) {
      console.error('Error adding expense:', error);
      setMessage('Failed to add expense');
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <p>Fill in the details below to add a new expense:</p>
      <form onSubmit={handleSubmit}>
        <label>Amount</label>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <label>Category</label>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <label>Description</label>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label>Currency</label>
        <input
          type="text"
          placeholder="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={optInEmail}
              onChange={(e) => setOptInEmail(e.target.checked)}
            />
            Receive email alerts
          </label>
          {optInEmail && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
        </div>
        <button type="submit">Add Expense</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddExpense;
