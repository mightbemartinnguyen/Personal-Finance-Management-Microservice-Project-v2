import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import Home from './components/Home';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import EditExpense from './components/EditExpense';
import ConvertCurrency from './components/ConvertCurrency';
import ViewHistoricalRates from './components/ViewHistoricalRates';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/edit-expense" element={<EditExpense />} />
          <Route path="/convert-currency" element={<ConvertCurrency />} />
          <Route path="/historical-rates" element={<ViewHistoricalRates />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
