# backend/model/fairness.py

import pandas as pd
import numpy as np
from fairlearn.metrics import (
    demographic_parity_difference,
    equal_opportunity_difference,
    false_positive_rate_difference
)
from sklearn.metrics import confusion_matrix

def evaluate_fairness(dataset):
    """
    Evaluate fairness metrics for a dataset of predictions
    """
    try:
        # Extract predictions and protected attributes
        predictions = dataset.get('predictions', [])
        protected_attributes = dataset.get('protected_attributes', {})
        
        if not predictions or not protected_attributes:
            return {
                'error': 'Missing predictions or protected attributes'
            }
        
        # Calculate basic fairness metrics
        metrics = {
            'demographic_parity': calculate_demographic_parity(predictions, protected_attributes),
            'equal_opportunity': calculate_equal_opportunity(predictions, protected_attributes),
            'predictive_parity': calculate_predictive_parity(predictions, protected_attributes)
        }
        
        # Add bias detection
        bias_analysis = detect_bias(predictions, protected_attributes)
        metrics['bias_analysis'] = bias_analysis
        
        return metrics
        
    except Exception as e:
        raise Exception(f"Error in fairness evaluation: {str(e)}")

def calculate_demographic_parity(predictions, protected_attributes):
    """Calculate demographic parity"""
    try:
        # For each protected attribute, calculate selection rate
        parity_metrics = {}
        for attr, values in protected_attributes.items():
            selection_rates = {}
            for value in set(values):
                mask = np.array(values) == value
                rate = np.mean(np.array(predictions)[mask])
                selection_rates[value] = rate
            
            # Calculate disparity
            rates = list(selection_rates.values())
            disparity = max(rates) - min(rates)
            parity_metrics[attr] = {
                'selection_rates': selection_rates,
                'disparity': disparity
            }
        
        return parity_metrics
    except Exception as e:
        return {'error': str(e)}

def calculate_equal_opportunity(predictions, protected_attributes):
    """Calculate equal opportunity"""
    try:
        # This would require true labels, which we don't have in this example
        return {
            'note': 'Equal opportunity requires true labels, which are not available in this example'
        }
    except Exception as e:
        return {'error': str(e)}

def calculate_predictive_parity(predictions, protected_attributes):
    """Calculate predictive parity"""
    try:
        # This would require true labels, which we don't have in this example
        return {
            'note': 'Predictive parity requires true labels, which are not available in this example'
        }
    except Exception as e:
        return {'error': str(e)}

def detect_bias(predictions, protected_attributes):
    """Detect potential bias in predictions"""
    try:
        bias_indicators = {}
        
        for attr, values in protected_attributes.items():
            # Calculate average prediction for each protected attribute value
            avg_predictions = {}
            for value in set(values):
                mask = np.array(values) == value
                avg_pred = np.mean(np.array(predictions)[mask])
                avg_predictions[value] = avg_pred
            
            # Check for significant differences
            values_list = list(avg_predictions.values())
            max_diff = max(values_list) - min(values_list)
            
            bias_indicators[attr] = {
                'average_predictions': avg_predictions,
                'maximum_difference': max_diff,
                'potential_bias': max_diff > 0.1  # Threshold for bias detection
            }
        
        return bias_indicators
    except Exception as e:
        return {'error': str(e)}

def calculate_demographic_parity(df):
    """Calculate demographic parity difference across protected attributes"""
    protected_attributes = ['gender', 'race', 'age_group']
    results = {}
    
    for attr in protected_attributes:
        if attr in df.columns:
            results[attr] = demographic_parity_difference(
                y_true=df['actual'],
                y_pred=df['predicted'],
                sensitive_features=df[attr]
            )
    
    return results

def calculate_equal_opportunity(df):
    """Calculate equal opportunity difference across protected attributes"""
    protected_attributes = ['gender', 'race', 'age_group']
    results = {}
    
    for attr in protected_attributes:
        if attr in df.columns:
            results[attr] = equal_opportunity_difference(
                y_true=df['actual'],
                y_pred=df['predicted'],
                sensitive_features=df[attr]
            )
    
    return results

def calculate_false_positive_rate(df):
    """Calculate false positive rate difference across protected attributes"""
    protected_attributes = ['gender', 'race', 'age_group']
    results = {}
    
    for attr in protected_attributes:
        if attr in df.columns:
            results[attr] = false_positive_rate_difference(
                y_true=df['actual'],
                y_pred=df['predicted'],
                sensitive_features=df[attr]
            )
    
    return results

def analyze_bias_patterns(df):
    """Analyze patterns of bias in the predictions"""
    patterns = {
        'gender_bias': analyze_gender_bias(df),
        'racial_bias': analyze_racial_bias(df),
        'age_bias': analyze_age_bias(df)
    }
    return patterns

def analyze_gender_bias(df):
    """Analyze gender-based bias patterns"""
    if 'gender' not in df.columns:
        return None
        
    gender_stats = df.groupby('gender')['predicted'].agg(['mean', 'count'])
    return {
        'selection_rate_difference': abs(gender_stats['mean'].diff().iloc[-1]),
        'representation': gender_stats['count'].to_dict()
    }

def analyze_racial_bias(df):
    """Analyze race-based bias patterns"""
    if 'race' not in df.columns:
        return None
        
    race_stats = df.groupby('race')['predicted'].agg(['mean', 'count'])
    return {
        'selection_rate_difference': race_stats['mean'].max() - race_stats['mean'].min(),
        'representation': race_stats['count'].to_dict()
    }

def analyze_age_bias(df):
    """Analyze age-based bias patterns"""
    if 'age_group' not in df.columns:
        return None
        
    age_stats = df.groupby('age_group')['predicted'].agg(['mean', 'count'])
    return {
        'selection_rate_difference': age_stats['mean'].max() - age_stats['mean'].min(),
        'representation': age_stats['count'].to_dict()
    }
