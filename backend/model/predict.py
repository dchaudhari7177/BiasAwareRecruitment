# backend/model/predict.py

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fairlearn.metrics import demographic_parity_difference
from fairlearn.postprocessing import ThresholdOptimizer
from sklearn.preprocessing import StandardScaler
import re
from textblob import TextBlob
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Download required NLTK data
try:
    nltk.download('vader_lexicon', quiet=True)
    nltk.download('punkt', quiet=True)
except:
    pass

class AdvancedBiasAwarePredictor:
    def __init__(self):
        self.model = RandomForestClassifier(random_state=42)
        self.success_predictor = GradientBoostingRegressor(random_state=42)
        self.scaler = StandardScaler()
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.skills_vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        
        # Industry-standard skills mapping
        self.industry_skills = {
            'software_engineering': ['python', 'java', 'javascript', 'react', 'node.js', 'sql', 'git', 'docker'],
            'data_science': ['python', 'r', 'sql', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'tableau'],
            'product_management': ['agile', 'scrum', 'jira', 'product strategy', 'user research', 'analytics'],
            'marketing': ['digital marketing', 'seo', 'social media', 'google analytics', 'content creation'],
            'finance': ['excel', 'financial modeling', 'risk analysis', 'accounting', 'bloomberg']
        }
        
    def analyze_sentiment_and_tone(self, text):
        """Analyze resume text for sentiment and potential bias indicators"""
        if not text:
            return {'sentiment': 'neutral', 'confidence': 0, 'bias_indicators': []}
        
        # Sentiment analysis
        blob = TextBlob(text.lower())
        sentiment_score = blob.sentiment.polarity
        
        # VADER sentiment for more nuanced analysis
        vader_scores = self.sentiment_analyzer.polarity_scores(text)
        
        # Detect potential bias indicators
        bias_indicators = []
        bias_patterns = {
            'gender_bias': ['he', 'she', 'his', 'her', 'man', 'woman', 'male', 'female'],
            'age_bias': ['young', 'old', 'senior', 'junior', 'experienced', 'fresh'],
            'cultural_bias': ['native', 'foreign', 'international', 'local'],
            'language_bias': ['fluent', 'native speaker', 'accent', 'bilingual']
        }
        
        text_lower = text.lower()
        for bias_type, patterns in bias_patterns.items():
            if any(pattern in text_lower for pattern in patterns):
                bias_indicators.append(bias_type)
        
        return {
            'sentiment': 'positive' if sentiment_score > 0.1 else 'negative' if sentiment_score < -0.1 else 'neutral',
            'confidence': abs(sentiment_score),
            'vader_scores': vader_scores,
            'bias_indicators': bias_indicators
        }
    
    def analyze_skills_gap(self, candidate_skills, target_role='software_engineering'):
        """Analyze skills gap between candidate and industry standards"""
        if not candidate_skills:
            return {'gap_score': 1.0, 'missing_skills': [], 'strength_areas': []}
        
        target_skills = self.industry_skills.get(target_role, [])
        candidate_skills_lower = [skill.lower() for skill in candidate_skills]
        
        # Find missing skills
        missing_skills = [skill for skill in target_skills if skill not in candidate_skills_lower]
        
        # Find strength areas (skills beyond requirements)
        strength_areas = [skill for skill in candidate_skills_lower if skill not in target_skills]
        
        # Calculate gap score (0 = perfect match, 1 = no match)
        gap_score = len(missing_skills) / len(target_skills) if target_skills else 1.0
        
        return {
            'gap_score': round(gap_score, 3),
            'missing_skills': missing_skills,
            'strength_areas': strength_areas,
            'match_percentage': round((1 - gap_score) * 100, 1)
        }
    
    def calculate_experience_relevance(self, experience_text, target_role='software_engineering'):
        """Calculate relevance of experience to target role"""
        if not experience_text:
            return {'relevance_score': 0, 'key_achievements': []}
        
        # Extract key achievements and responsibilities
        sentences = re.split(r'[.!?]+', experience_text)
        relevant_keywords = self.industry_skills.get(target_role, [])
        
        relevant_sentences = []
        relevance_score = 0
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            keyword_matches = sum(1 for keyword in relevant_keywords if keyword in sentence_lower)
            if keyword_matches > 0:
                relevant_sentences.append(sentence.strip())
                relevance_score += keyword_matches
        
        # Normalize relevance score
        max_possible = len(relevant_keywords) * len(sentences)
        relevance_score = relevance_score / max_possible if max_possible > 0 else 0
        
        return {
            'relevance_score': round(relevance_score, 3),
            'key_achievements': relevant_sentences[:5],  # Top 5 relevant achievements
            'relevance_percentage': round(relevance_score * 100, 1)
        }
    
    def predict_success_probability(self, features):
        """Predict candidate success probability using advanced features"""
        # Enhanced feature engineering
        enhanced_features = {
            'education_score': features.get('education_level', 0) / 3,  # Normalize to 0-1
            'experience_score': min(features.get('years_experience', 0) / 10, 1),  # Cap at 10 years
            'skills_score': features.get('skills_match', 0),
            'project_score': features.get('project_complexity', 0) / 3,
            'sentiment_score': features.get('sentiment_score', 0.5),
            'relevance_score': features.get('experience_relevance', 0),
            'gap_score': 1 - features.get('skills_gap', 1)  # Invert gap score
        }
        
        # Calculate success probability using weighted combination
        weights = {
            'education_score': 0.15,
            'experience_score': 0.20,
            'skills_score': 0.25,
            'project_score': 0.15,
            'sentiment_score': 0.10,
            'relevance_score': 0.10,
            'gap_score': 0.05
        }
        
        success_probability = sum(
            enhanced_features[feature] * weight 
            for feature, weight in weights.items()
        )
        
        return round(success_probability, 3)
    
    def analyze_cultural_fit(self, text, company_culture='tech_startup'):
        """Analyze cultural fit indicators"""
        culture_keywords = {
            'tech_startup': ['innovative', 'fast-paced', 'collaborative', 'agile', 'creative'],
            'corporate': ['professional', 'structured', 'team-oriented', 'detail-oriented'],
            'consulting': ['analytical', 'client-focused', 'strategic', 'communication']
        }
        
        if not text:
            return {'fit_score': 0, 'culture_alignment': []}
        
        target_keywords = culture_keywords.get(company_culture, [])
        text_lower = text.lower()
        
        matched_keywords = [keyword for keyword in target_keywords if keyword in text_lower]
        fit_score = len(matched_keywords) / len(target_keywords) if target_keywords else 0
        
        return {
            'fit_score': round(fit_score, 3),
            'culture_alignment': matched_keywords,
            'fit_percentage': round(fit_score * 100, 1)
        }

# Initialize the enhanced predictor
enhanced_predictor = AdvancedBiasAwarePredictor()

def predict_candidate(data):
    """
    Make an enhanced prediction for a candidate based on their resume data
    """
    try:
        # Extract basic features
        features = {
            'education_level': data.get('education_level', 0),
            'years_experience': data.get('years_experience', 0),
            'skills_match': data.get('skills_match', 0),
            'project_complexity': data.get('project_complexity', 0)
        }
        
        # Get resume text for advanced analysis
        resume_text = data.get('text', '')
        experience_text = ' '.join(data.get('experience', []))
        skills = data.get('skills', [])
        
        # Advanced analysis
        sentiment_analysis = enhanced_predictor.analyze_sentiment_and_tone(resume_text)
        skills_gap_analysis = enhanced_predictor.analyze_skills_gap(skills)
        experience_relevance = enhanced_predictor.calculate_experience_relevance(experience_text)
        cultural_fit = enhanced_predictor.analyze_cultural_fit(resume_text)
        
        # Enhanced features for success prediction
        enhanced_features = {
            **features,
            'sentiment_score': (sentiment_analysis['vader_scores']['compound'] + 1) / 2,  # Normalize to 0-1
            'experience_relevance': experience_relevance['relevance_score'],
            'skills_gap': skills_gap_analysis['gap_score']
        }
        
        # Predict success probability
        success_probability = enhanced_predictor.predict_success_probability(enhanced_features)
        
        # Calculate overall score
        base_score = (
            features['education_level'] * 0.25 +
            min(features['years_experience'] / 10, 1) * 0.25 +
            features['skills_match'] * 0.25 +
            features['project_complexity'] / 3 * 0.25
        )
        
        # Adjust score based on advanced analysis
        adjusted_score = base_score * (
            0.7 +  # Base weight
            success_probability * 0.2 +  # Success probability weight
            (1 - skills_gap_analysis['gap_score']) * 0.1  # Skills gap weight
        )
        
        # Calculate confidence based on data completeness and analysis quality
        confidence = sum(1 for v in features.values() if v > 0) / len(features)
        confidence *= (1 + len(skills) / 10)  # Boost confidence with more skills
        
        return {
            'score': round(adjusted_score * 100, 2),
            'confidence': round(min(confidence * 100, 100), 2),
            'success_probability': success_probability,
            'features': features,
            'parsed_data': data,
            'advanced_analysis': {
                'sentiment_analysis': sentiment_analysis,
                'skills_gap_analysis': skills_gap_analysis,
                'experience_relevance': experience_relevance,
                'cultural_fit': cultural_fit,
                'bias_indicators': sentiment_analysis['bias_indicators']
            }
        }
        
    except Exception as e:
        raise Exception(f"Error in enhanced prediction: {str(e)}")
