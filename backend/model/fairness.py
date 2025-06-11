# backend/model/fairness.py

from fairlearn.metrics import demographic_parity_difference
import pandas as pd

def evaluate_fairness(data):
    df = pd.DataFrame(data)
    y_true = df['label']
    y_pred = df['prediction']
    sensitive = df['gender']

    dp = demographic_parity_difference(y_true, y_pred, sensitive_features=sensitive)
    
    return {
        "demographic_parity_difference": dp
    }
