from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import requests

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Currency conversion route
@app.route('/convert', methods=['GET'])
def convert_currency():
    base_currency = request.args.get('base')
    final_currency = request.args.get('final')
    amount = request.args.get('amount', type=float)

    if not base_currency or not final_currency or amount is None:
        logging.error("Missing required parameters for currency conversion.")
        return jsonify({'error': 'Missing required parameters'}), 400

    api_url = f"https://cs361-currency-microservice.onrender.com/convert"
    
    try:
        payload = {'base': base_currency, 'final': final_currency, 'amount': amount}
        response = requests.get(api_url, params=payload)
        data = response.json()
        if response.status_code == 200:
            converted_amount = data['converted_amount']
            logging.info("Currency conversion: %f %s to %f %s", amount, base_currency, converted_amount, final_currency)
            return jsonify({'converted_amount': round(converted_amount, 2)}), 200
        else:
            logging.error("Error in currency conversion: %s", data.get('error', 'Unknown error'))
            return jsonify({'error': data.get('error', 'Unknown error')}), response.status_code
    except Exception as e:
        logging.error("Error during currency conversion: %s", e)
        return jsonify({'error': str(e)}), 500

# Main entry point
if __name__ == '__main__':
    app.run(port=5001, debug=True)
