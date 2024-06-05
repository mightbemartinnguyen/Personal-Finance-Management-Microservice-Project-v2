import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/style.css';

function Menu() {
  return (
    <nav className="menu">
      <NavLink to="/" exact className="menu-button" activeClassName="active">
        Home
      </NavLink>
      <NavLink to="/add-expense" className="menu-button" activeClassName="active">
        Add Expense
      </NavLink>
      <NavLink to="/expenses" className="menu-button" activeClassName="active">
        View Expenses
      </NavLink>
      <NavLink to="/edit-expense" className="menu-button" activeClassName="active">
        Edit Expense
      </NavLink>
      <NavLink to="/convert-currency" className="menu-button" activeClassName="active">
        Convert Currency
      </NavLink>
      <NavLink to="/historical-rates" className="menu-button" activeClassName="active">
        View Historical Rates
      </NavLink>
    </nav>
  );
}

export default Menu;
