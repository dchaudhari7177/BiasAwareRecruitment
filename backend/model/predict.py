# backend/model/predict.py

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from fairlearn.metrics import demographic_parity_difference
from fairlearn.postprocessing import ThresholdOptimizer
from sklearn.preprocessing import StandardScaler

class BiasAwarePredictor:
    def __init__(self):
        self.model = RandomForestClassifier(random_state=42)
        self.scaler = StandardScaler()
        self.threshold_optimizer = ThresholdOptimizer(
            estimator=self.model,
            constraints="demographic_parity",
            prefit=False
        )
        
    def preprocess_features(self, data):
        """Preprocess candidate features"""
        # Extract relevant features
        features = pd.DataFrame({
            'education_level': data.get('education_level', 0),
            'years_experience': data.get('years_experience', 0),
            'skills_match': data.get('skills_match', 0),
            'certifications': data.get('certifications', 0),
            'project_complexity': data.get('project_complexity', 0)
        })
        return self.scaler.fit_transform(features)
    
    def predict_candidate(self, data):
        """Make prediction with fairness constraints"""
        features = self.preprocess_features(data)
        prediction = self.model.predict_proba(features)[0]
        
        # Apply fairness constraints
        fair_prediction = self.threshold_optimizer.predict_proba(features)[0]
        
        return {
            'raw_score': float(prediction[1]),
            'fair_score': float(fair_prediction[1]),
            'recommendation': 'Recommended' if fair_prediction[1] > 0.5 else 'Not Recommended',
            'fairness_metrics': self._calculate_fairness_metrics(data)
        }
    
    def _calculate_fairness_metrics(self, data):
        """Calculate fairness metrics for the prediction"""
        return {
            'demographic_parity': self._calculate_demographic_parity(data),
            'equal_opportunity': self._calculate_equal_opportunity(data)
        }
    
    def _calculate_demographic_parity(self, data):
        """Calculate demographic parity difference"""
        # Implementation would use actual demographic data
        return 0.0  # Placeholder
    
    def _calculate_equal_opportunity(self, data):
        """Calculate equal opportunity difference"""
        # Implementation would use actual demographic data
        return 0.0  # Placeholder

# Initialize the predictor
predictor = BiasAwarePredictor()

def predict_candidate(data):
    """
    Make a prediction for a candidate based on their resume data
    """
    try:
        # Extract features from the parsed resume data
        features = {
            'education_level': data.get('education_level', 0),
            'years_experience': data.get('years_experience', 0),
            'skills_match': data.get('skills_match', 0),
            'project_complexity': data.get('project_complexity', 0)
        }
        
        # Convert features to array
        feature_array = np.array([[
            features['education_level'],
            features['years_experience'],
            features['skills_match'],
            features['project_complexity']
        ]])
        
        # For now, return a simple scoring based on features
        # In a real system, this would use a trained model
        score = (
            features['education_level'] * 0.3 +
            min(features['years_experience'] / 10, 1) * 0.3 +
            features['skills_match'] * 0.2 +
            features['project_complexity'] / 3 * 0.2
        )
        
        # Calculate confidence based on feature completeness
        confidence = sum(1 for v in features.values() if v > 0) / len(features)
        
        return {
            'score': round(score * 100, 2),
            'confidence': round(confidence * 100, 2),
            'features': features,
            'parsed_data': data
        }
        
    except Exception as e:
        raise Exception(f"Error in prediction: {str(e)}")
