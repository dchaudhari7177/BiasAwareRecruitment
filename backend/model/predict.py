# backend/model/predict.py

def predict_candidate(data):
    features = data['features']
    score = int(features["education"]) + int(features["experience"]) + int(features["skills"])
    
    decision = "Shortlisted" if score >= 2 else "Rejected"
    
    return {
        "decision": decision,
        "score": score
    }
