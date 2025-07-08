"""
Candidate Prediction Module

Provides advanced bias-aware candidate prediction and analysis utilities.
"""
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
from typing import Any, Dict, List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Download required NLTK data
try:
    nltk.download('vader_lexicon', quiet=True)
    nltk.download('punkt', quiet=True)
except Exception as e:
    logger.error(f"Error downloading NLTK data: {str(e)}")

class AdvancedBiasAwarePredictor:
    """
    Advanced predictor for bias-aware candidate evaluation.
    Includes sentiment, skills gap, experience relevance, and cultural fit analysis.
    """
    def __init__(self) -> None:
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

    def analyze_sentiment_and_tone(self, text: str) -> Dict[str, Any]:
        """
        Analyze resume text for sentiment and potential bias indicators.
        """
        if not text:
            return {'sentiment': 'neutral', 'confidence': 0, 'bias_indicators': []}
        blob = TextBlob(text.lower())
        sentiment_score = blob.sentiment.polarity
        vader_scores = self.sentiment_analyzer.polarity_scores(text)
        bias_indicators = []
        bias_patterns = {
            'gender_bias': ['he', 'she', 'his', 'her', 'man', 'woman', 'male', 'female'],
            'age_bias': ['young', 'old', 'senior', 'junior', 'experienced', 'fresh'],
            'cultural_bias': ['native', 'foreign', 'international', 'local'],
            'language_bias': ['fluent', 'native speaker', 'accent', 'bilingual']
        }
        bias_explanations = {
            'gender_bias': {
                'explanation': 'Gendered language detected, which may introduce gender bias.',
                'suggestion': 'Use gender-neutral terms and avoid pronouns or gendered job titles.'
            },
            'age_bias': {
                'explanation': 'Age-related terms detected, which may introduce age bias.',
                'suggestion': 'Avoid referencing age, seniority, or youth directly.'
            },
            'cultural_bias': {
                'explanation': 'Cultural or nationality-related terms detected, which may introduce cultural bias.',
                'suggestion': 'Focus on skills and experience rather than cultural or national background.'
            },
            'language_bias': {
                'explanation': 'Language proficiency or accent references detected, which may introduce language bias.',
                'suggestion': 'Only mention language skills if directly relevant to the job.'
            }
        }
        text_lower = text.lower()
        for bias_type, patterns in bias_patterns.items():
            if any(pattern in text_lower for pattern in patterns):
                bias_indicators.append({
                    'type': bias_type,
                    'explanation': bias_explanations[bias_type]['explanation'],
                    'suggestion': bias_explanations[bias_type]['suggestion']
                })
        return {
            'sentiment': 'positive' if sentiment_score > 0.1 else 'negative' if sentiment_score < -0.1 else 'neutral',
            'confidence': abs(sentiment_score),
            'vader_scores': vader_scores,
            'bias_indicators': bias_indicators
        }

    def analyze_skills_gap(self, candidate_skills: List[str], target_role: str = 'software_engineering') -> Dict[str, Any]:
        """
        Analyze skills gap between candidate and industry standards.
        """
        if not candidate_skills:
            return {'gap_score': 1.0, 'missing_skills': [], 'strength_areas': []}
        target_skills = self.industry_skills.get(target_role, [])
        candidate_skills_lower = [skill.lower() for skill in candidate_skills]
        missing_skills = [skill for skill in target_skills if skill not in candidate_skills_lower]
        strength_areas = [skill for skill in candidate_skills_lower if skill not in target_skills]
        gap_score = len(missing_skills) / len(target_skills) if target_skills else 1.0
        return {
            'gap_score': round(gap_score, 3),
            'missing_skills': missing_skills,
            'strength_areas': strength_areas,
            'match_percentage': round((1 - gap_score) * 100, 1)
        }

    def calculate_experience_relevance(self, experience_text: str, target_role: str = 'software_engineering') -> Dict[str, Any]:
        """
        Calculate relevance of experience to target role.
        """
        if not experience_text:
            return {'relevance_score': 0, 'key_achievements': []}
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
        max_possible = len(relevant_keywords) * len(sentences)
        relevance_score = relevance_score / max_possible if max_possible > 0 else 0
        return {
            'relevance_score': round(relevance_score, 3),
            'key_achievements': relevant_sentences[:5],
            'relevance_percentage': round(relevance_score * 100, 1)
        }

    def predict_success_probability(self, features: Dict[str, Any]) -> float:
        """
        Predict candidate success probability using advanced features.
        """
        enhanced_features = {
            'education_score': features.get('education_level', 0) / 3,
            'experience_score': min(features.get('years_experience', 0) / 10, 1),
            'skills_score': features.get('skills_match', 0),
            'project_score': features.get('project_complexity', 0) / 3,
            'sentiment_score': features.get('sentiment_score', 0.5),
            'relevance_score': features.get('experience_relevance', 0),
            'gap_score': 1 - features.get('skills_gap', 1)
        }
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

    def analyze_cultural_fit(self, text: str, company_culture: str = 'tech_startup') -> Dict[str, Any]:
        """
        Analyze cultural fit indicators.
        """
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


def predict_candidate(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main function to predict candidate suitability and provide bias-aware analysis.
    Args:
        data: Dictionary with parsed resume and features.
    Returns:
        Dictionary with prediction, analysis, and explanations.
    """
    predictor = AdvancedBiasAwarePredictor()
    # Sentiment and bias analysis
    sentiment_result = predictor.analyze_sentiment_and_tone(data.get('text', ''))
    # Skills gap analysis
    skills_gap_result = predictor.analyze_skills_gap(data.get('skills', []))
    # Experience relevance
    experience_text = '\n'.join(data.get('experience', [])) if isinstance(data.get('experience', []), list) else data.get('experience', '')
    experience_relevance_result = predictor.calculate_experience_relevance(experience_text)
    # Cultural fit
    culture_fit_result = predictor.analyze_cultural_fit(data.get('text', ''))
    # Prepare features for success probability
    features = {
        'education_level': data.get('education_level', 0),
        'years_experience': data.get('years_experience', 0),
        'skills_match': data.get('skills_match', 0),
        'project_complexity': data.get('project_complexity', 0),
        'sentiment_score': sentiment_result.get('confidence', 0.5),
        'experience_relevance': experience_relevance_result.get('relevance_score', 0),
        'skills_gap': skills_gap_result.get('gap_score', 1)
    }
    success_probability = predictor.predict_success_probability(features)
    return {
        'success_probability': success_probability,
        'sentiment_analysis': sentiment_result,
        'skills_gap_analysis': skills_gap_result,
        'experience_relevance': experience_relevance_result,
        'cultural_fit': culture_fit_result,
        'explanation': 'Prediction is based on education, experience, skills, project complexity, sentiment, and bias-aware analysis.'
    }
