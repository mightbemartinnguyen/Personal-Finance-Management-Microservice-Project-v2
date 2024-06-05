from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

EXPENSE_STORAGE_URL = "http://127.0.0.1:5001"
EMAIL_NOTIFICATION_URL = "http://127.0.0.1:5002"
CURRENCY_CONVERSION_URL = "http://127.0.0.1:5003"

# Add a new expense
@app.route('/add_expense', methods=['POST'])
def add_expense():
    data = request.get_json()
    response = requests.post(f"{EXPENSE_STORAGE_URL}/store_expense", json=data)
    if response.status_code == 201:
        expense = response.json()['expense']
        if expense.get('email'):
            requests.post(f"{EMAIL_NOTIFICATION_URL}/send_email", json=expense)
        return jsonify({'message': 'Expense added successfully!', 'expense': expense}), 201
    return jsonify({'message': 'Failed to add expense'}), 500

# Edit an expense
@app.route('/edit_expense/<int:expense_id>', methods=['PUT'])
def edit_expense(expense_id):
    data = request.get_json()
    response = requests.put(f"{EXPENSE_STORAGE_URL}/update_expense/{expense_id}", json=data)
    if response.status_code == 200:
        return jsonify({'message': 'Expense updated successfully!', 'expense': response.json()['expense']})
    return jsonify({'message': 'Failed to update expense'}), 500

# Delete an expense
@app.route('/delete_expense/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    response = requests.delete(f"{EXPENSE_STORAGE_URL}/delete_expense/{expense_id}")
    if response.status_code == 200:
        return jsonify({'message': 'Expense deleted successfully!'})
    return jsonify({'message': 'Failed to delete expense'}), 500

# View all expenses
@app.route('/view_expenses', methods=['GET'])
def view_expenses():
    response = requests.get(f"{EXPENSE_STORAGE_URL}/view_expenses")
    if response.status_code == 200:
        return jsonify(response.json())
    return jsonify({'message': 'Failed to fetch expenses'}), 500

# View a single expense by ID
@app.route('/view_expense/<int:expense_id>', methods=['GET'])
def view_expense(expense_id):
    response = requests.get(f"{EXPENSE_STORAGE_URL}/view_expense/{expense_id}")
    if response.status_code == 200:
        return jsonify(response.json())
    return jsonify({'message': 'Failed to fetch expense'}), 500

# Currency conversion route
@app.route('/convert', methods=['GET'])
def convert_currency():
    base_currency = request.args.get('base')
    final_currency = request.args.get('final')
    amount = request.args.get('amount', type=float)

    response = requests.get(f"{CURRENCY_CONVERSION_URL}/convert", params={'base': base_currency, 'final': final_currency, 'amount': amount})
    if response.status_code == 200:
        return jsonify(response.json())
    return jsonify({'error': 'Failed to convert currency'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
