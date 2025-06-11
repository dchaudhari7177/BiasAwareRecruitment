from pdfminer.high_level import extract_text

def parse_resume(file_storage):
    # Use file_storage.stream to extract text
    text = extract_text(file_storage.stream)
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
