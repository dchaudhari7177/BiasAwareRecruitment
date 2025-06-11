# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.resume_parser import parse_resume
from model.predict import predict_candidate
from model.fairness import evaluate_fairness

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

@app.route('/')
def index():
    return "Bias-Aware Recruitment System Backend Running!"

@app.route('/upload', methods=['POST'])
def upload_resume():
    file = request.files['resume']
    data = parse_resume(file)
    prediction = predict_candidate(data)
    return jsonify(prediction)

@app.route('/evaluate_bias', methods=['POST'])
def evaluate_bias():
    dataset = request.json.get('data')
    result = evaluate_fairness(dataset)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
