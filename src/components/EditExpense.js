import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';

function EditExpense() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('');
  const [refresh, setRefresh] = useState(false); // Add refresh state

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/view_expenses');
        setExpenses(response.data.expenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        alert('Failed to fetch expenses');
      }
    };
    fetchExpenses();
  }, [refresh]); // Include refresh state in dependency array

  const handleSelectExpense = async (expenseId) => {
    setSelectedExpenseId(expenseId);
    if (expenseId) {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/view_expense/${expenseId}`);
        const expense = response.data.expense;
        setAmount(expense.amount);
        setCategory(expense.category);
        setDescription(expense.description);
        setCurrency(expense.currency);
      } catch (error) {
        console.error('Error fetching expense:', error);
        alert('Failed to fetch expense details');
      }
    } else {
      setAmount('');
      setCategory('');
      setDescription('');
      setCurrency('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedExpense = { amount, category, description, currency };
    try {
      const response = await axios.put(`http://127.0.0.1:5000/edit_expense/${selectedExpenseId}`, updatedExpense);
      alert(response.data.message);
      navigate('/expenses');
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense');
    }
  };

  const handleDelete = async () => {
    if (selectedExpenseId && window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await axios.delete(`http://127.0.0.1:5000/delete_expense/${selectedExpenseId}`);
        alert(response.data.message);
        setSelectedExpenseId('');
        setAmount('');
        setCategory('');
        setDescription('');
        setCurrency('');
        const updatedExpenses = expenses.filter(expense => expense.id !== selectedExpenseId);
        setExpenses(updatedExpenses);
        setRefresh(!refresh); // Toggle refresh state to force re-render
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      }
    }
  };

  return (
    <div>
      <h2>Edit Expense</h2>
      <p>Select an expense to edit or delete:</p>
      <div>
        <label>Select Expense</label>
        <select
          value={selectedExpenseId}
          onChange={(e) => handleSelectExpense(e.target.value)}
        >
          <option value="">Select an expense</option>
          {expenses.map((expense) => (
            <option key={expense._id} value={expense._id}>
              {expense.currency} {expense.amount} - {expense.category} - {expense.description}
            </option>
          ))}
        </select>
      </div>
      {selectedExpenseId && (
        <form onSubmit={handleSubmit}>
          <label>Currency</label>
          <input
            type="text"
            placeholder="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          />
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
          <button type="submit">Update Expense</button>
          <button type="button" onClick={handleDelete} className="delete-button">Delete Expense</button>
        </form>
      )}
    </div>
  );
}

export default EditExpense;
