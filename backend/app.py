# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.resume_parser import parse_resume
from model.predict import predict_candidate
from model.fairness import evaluate_fairness
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Configure CORS to allow requests from the frontend
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/')
def index():
    return "Bias-Aware Recruitment System Backend Running!"

@app.route('/upload', methods=['POST'])
def upload_resume():
    try:
        logger.debug("Received upload request")
        
        if 'resume' not in request.files:
            logger.error("No file in request")
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['resume']
        logger.debug(f"Received file: {file.filename}")
        
        if file.filename == '':
            logger.error("Empty filename")
            return jsonify({"error": "No file selected"}), 400
            
        if not file.filename.endswith('.pdf'):
            logger.error(f"Invalid file type: {file.filename}")
            return jsonify({"error": "Only PDF files are allowed"}), 400

        # Parse the resume
        logger.debug("Attempting to parse resume")
        try:
            data = parse_resume(file)
            logger.debug(f"Resume parsed successfully: {data}")
        except Exception as parse_error:
            logger.error(f"Error parsing resume: {str(parse_error)}")
            logger.error(traceback.format_exc())
            return jsonify({"error": f"Error parsing resume: {str(parse_error)}"}), 500
        
        # Make prediction
        logger.debug("Attempting to make prediction")
        try:
            prediction = predict_candidate(data)
            logger.debug(f"Prediction made successfully: {prediction}")
        except Exception as predict_error:
            logger.error(f"Error making prediction: {str(predict_error)}")
            logger.error(traceback.format_exc())
            return jsonify({"error": f"Error making prediction: {str(predict_error)}"}), 500
        
        return jsonify(prediction)
        
    except Exception as e:
        logger.error(f"Unexpected error in upload_resume: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Error processing resume: {str(e)}"}), 500

@app.route('/evaluate_bias', methods=['POST'])
def evaluate_bias():
    try:
        dataset = request.json.get('data')
        if not dataset:
            return jsonify({"error": "No data provided"}), 400
            
        result = evaluate_fairness(dataset)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error evaluating bias: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Error evaluating bias"}), 500

if __name__ == '__main__':
    app.run(debug=True)
