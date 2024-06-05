import React from 'react';
import '../styles/style.css';

function Home() {
  return (
    <div className="home-container">
      <h2>Welcome to Personal Finance Management</h2>
      <p>
        This application helps you manage your personal finances by providing the following features:
      </p>
      <ol>
        <li><strong>Add Expense:</strong> Record your expenses with details such as amount, category, description, and currency.</li>
        <li><strong>View Expenses:</strong> View all your recorded expenses in a tabular format.</li>
        <li><strong>Edit Expense:</strong> Edit details of your existing expenses and delete them if necessary.</li>
        <li><strong>Convert Currency:</strong> Convert amounts from one currency to another using up-to-date exchange rates.</li>
        <li><strong>View Historical Rates:</strong> View historical currency exchange rates for any date and currency.</li>
      </ol>
      <p>
        Start by using the menu above to navigate to the desired feature.
      </p>
    </div>
  );
}

export default Home;
