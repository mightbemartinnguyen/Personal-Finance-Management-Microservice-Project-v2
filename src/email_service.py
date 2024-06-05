from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Configuration for SMTP email
SMTP_SERVER = "smtp.gmail.com"  # Replace with your SMTP server
SMTP_PORT = 587  # Replace with your SMTP server port
SMTP_USERNAME = ""  # Replace with your email username
SMTP_PASSWORD = ""  # Replace with your email password
EMAIL_FROM = ""  # Replace with your email address
EMAIL_SUBJECT = "New Expense Added"

def send_email(email, subject, body):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_FROM, msg['To'], text)
        server.quit()

        logging.info("Email sent successfully to %s!", email)
        return jsonify({'message': 'Email sent successfully!'}), 200
    except Exception as e:
        logging.error("Failed to send email. Error: %s", e)
        return jsonify({'message': 'Failed to send email.'}), 500

@app.route('/send_email', methods=['POST'])
def send_expense_email():
    data = request.get_json()
    email = data['email']
    amount = data['amount']
    currency = data['currency']
    category = data['category']
    description = data['description']

    subject = "New Expense Added"
    body = f"A new expense has been added:\n\n" \
           f"Amount: {amount} {currency}\n" \
           f"Category: {category}\n" \
           f"Description: {description}\n"

    return send_email(email, subject, body)

@app.route('/send_historical_rates_email', methods=['POST'])
def send_historical_rates_email():
    data = request.get_json()
    email = data['email']
    date = data['date']
    currency = data['currency']
    rates = data['rates']

    subject = f"Historical Rates for {currency} on {date}"
    body = f"Historical rates for {currency} on {date}:\n\n"
    for curr, rate in rates.items():
        body += f"{curr}: {rate['value']}\n"

    return send_email(email, subject, body)

if __name__ == '__main__':
    app.run(port=5003, debug=True)
