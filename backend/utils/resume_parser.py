# backend/utils/resume_parser.py

import pdfminer.high_level

def parse_resume(file):
    text = pdfminer.high_level.extract_text(file)
    return {
        'raw_text': text,
        'features': extract_features(text)
    }

def extract_features(text):
    features = {
        "education": "bachelor" in text.lower(),
        "experience": "experience" in text.lower(),
        "skills": "python" in text.lower() or "machine learning" in text.lower(),
    }
    return features
