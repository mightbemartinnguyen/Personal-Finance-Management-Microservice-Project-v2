from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import requests

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

CURRENCY_API_KEY = "cur_live_P4baYYFqRqH9qt90MozmacYq1eFe4Gigi3D5euYg"  # Replace with your actual API key

@app.route('/historical_rates', methods=['GET'])
def get_historical_rates():
    date = request.args.get('date')
    base_currency = request.args.get('base_currency')

    if not date or not base_currency:
        logging.error("Missing required parameters for historical rates.")
        return jsonify({'error': 'Missing required parameters'}), 400

    api_url = f"https://api.currencyapi.com/v3/historical?apikey={CURRENCY_API_KEY}&date={date}&base_currency={base_currency}"
    
    try:
        response = requests.get(api_url)
        data = response.json()
        if 'data' in data:
            logging.info("Historical rates retrieved for %s on %s", base_currency, date)
            return jsonify(data['data']), 200
        else:
            logging.error("Unexpected response format.")
            return jsonify({'error': 'Unexpected response format'}), 500
    except Exception as e:
        logging.error("Error fetching historical rates: %s", e)
        return jsonify({'error': str(e)}), 500

# Main entry point
if __name__ == '__main__':
    app.run(port=5002, debug=True)
