from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import pymongo
from bson import ObjectId
import requests

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

# MongoDB configuration
MONGO_URI = "mongodb+srv://actuallymartinnguyen:Darksouls456258@cluster1.vcmjims.mongodb.net/personal_finance"
client = pymongo.MongoClient(MONGO_URI)
db = client['personal_finance']
expenses_collection = db['expenses']

# Email service URL
EMAIL_SERVICE_URL = 'http://localhost:5003/send_email'

# Function to send email alert
def send_email_alert(expense):
    if not expense['email']:
        logging.info("Email alerts not opted in for this expense.")
        return
    
    try:
        response = requests.post(EMAIL_SERVICE_URL, json=expense)
        if response.status_code == 200:
            logging.info("Email alert sent successfully to %s!", expense['email'])
        else:
            logging.error("Failed to send email alert. Status code: %d", response.status_code)
    except Exception as e:
        logging.error("Failed to send email alert. Error: %s", e)

# Add a new expense
@app.route('/add_expense', methods=['POST'])
def add_expense():
    data = request.get_json()
    new_expense = {
        'amount': data['amount'],
        'category': data['category'],
        'description': data['description'],
        'currency': data['currency'],
        'email': data['email']  # Include the email address or None if not opted in
    }
    result = expenses_collection.insert_one(new_expense)
    new_expense['_id'] = str(result.inserted_id)
    send_email_alert(new_expense)  # Send email alert
    logging.info("Expense added: %s", new_expense)
    return jsonify({'message': 'Expense added successfully!', 'expense': new_expense}), 201

# View all expenses
@app.route('/view_expenses', methods=['GET'])
def view_expenses():
    logging.info("Viewing all expenses.")
    expenses = list(expenses_collection.find())
    for expense in expenses:
        expense['_id'] = str(expense['_id'])
    return jsonify({'expenses': expenses})

# View a single expense by ID
@app.route('/view_expense/<expense_id>', methods=['GET'])
def view_expense(expense_id):
    try:
        expense = expenses_collection.find_one({'_id': ObjectId(expense_id)})
        if not expense:
            logging.warning("Expense not found with ID: %s", expense_id)
            return jsonify({'message': 'Expense not found!'}), 404
        expense['_id'] = str(expense['_id'])
        logging.info("Viewing expense with ID: %s", expense_id)
        return jsonify({'expense': expense})
    except Exception as e:
        logging.error("Error fetching expense: %s", e)
        return jsonify({'message': 'Error fetching expense'}), 500

# Edit an expense
@app.route('/edit_expense/<expense_id>', methods=['PUT'])
def edit_expense(expense_id):
    data = request.get_json()
    update_data = {
        'amount': data.get('amount'),
        'category': data.get('category'),
        'description': data.get('description'),
        'currency': data.get('currency')
    }
    try:
        result = expenses_collection.update_one(
            {'_id': ObjectId(expense_id)},
            {'$set': update_data}
        )
        if result.matched_count == 0:
            logging.warning("Expense not found with ID: %s", expense_id)
            return jsonify({'message': 'Expense not found!'}), 404
        updated_expense = expenses_collection.find_one({'_id': ObjectId(expense_id)})
        updated_expense['_id'] = str(updated_expense['_id'])
        logging.info("Expense updated: %s", updated_expense)
        return jsonify({'message': 'Expense updated successfully!', 'expense': updated_expense})
    except Exception as e:
        logging.error("Error updating expense: %s", e)
        return jsonify({'message': 'Error updating expense'}), 500

# Delete an expense
@app.route('/delete_expense/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    try:
        result = expenses_collection.delete_one({'_id': ObjectId(expense_id)})
        if result.deleted_count == 0:
            logging.warning("Expense not found with ID: %s", expense_id)
            return jsonify({'message': 'Expense not found!'}), 404
        logging.info("Expense deleted with ID: %s", expense_id)
        return jsonify({'message': 'Expense deleted successfully!'})
    except Exception as e:
        logging.error("Error deleting expense: %s", e)
        return jsonify({'message': 'Error deleting expense'}), 500

# Main entry point
if __name__ == '__main__':
    app.run(port=5000, debug=True)
