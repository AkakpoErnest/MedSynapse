import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import json

class HealthDataAnalyzer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
    
    def analyze_lab_results(self, data):
        """
        Analyze lab results data for patterns and anomalies
        """
        try:
            df = pd.DataFrame(data)
            
            # Basic statistics
            stats = {
                'mean_values': df.mean().to_dict(),
                'std_values': df.std().to_dict(),
                'correlations': df.corr().to_dict()
            }
            
            # Detect anomalies
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            if len(numeric_cols) > 0:
                X = df[numeric_cols].fillna(df[numeric_cols].mean())
                X_scaled = self.scaler.fit_transform(X)
                anomalies = self.anomaly_detector.fit_predict(X_scaled)
                
                stats['anomaly_count'] = np.sum(anomalies == -1)
                stats['anomaly_percentage'] = (np.sum(anomalies == -1) / len(anomalies)) * 100
            
            return stats
            
        except Exception as e:
            return {'error': str(e)}
    
    def analyze_wearable_data(self, data):
        """
        Analyze wearable device data for health trends
        """
        try:
            df = pd.DataFrame(data)
            
            # Calculate daily averages
            if 'timestamp' in df.columns:
                df['date'] = pd.to_datetime(df['timestamp']).dt.date
                daily_stats = df.groupby('date').agg({
                    'heart_rate': ['mean', 'min', 'max'],
                    'steps': 'sum',
                    'sleep_hours': 'mean'
                }).to_dict()
                
                return {
                    'daily_stats': daily_stats,
                    'total_records': len(df),
                    'date_range': {
                        'start': str(df['date'].min()),
                        'end': str(df['date'].max())
                    }
                }
            
            return {'error': 'No timestamp column found'}
            
        except Exception as e:
            return {'error': str(e)}
    
    def generate_insights(self, analysis_results):
        """
        Generate human-readable insights from analysis
        """
        insights = []
        
        if 'anomaly_count' in analysis_results:
            if analysis_results['anomaly_percentage'] > 5:
                insights.append(f"High anomaly rate detected: {analysis_results['anomaly_percentage']:.1f}% of data points")
            else:
                insights.append("Data appears consistent with low anomaly rate")
        
        if 'correlations' in analysis_results:
            correlations = analysis_results['correlations']
            # Find strong correlations
            for col1 in correlations:
                for col2 in correlations[col1]:
                    if col1 != col2 and abs(correlations[col1][col2]) > 0.7:
                        insights.append(f"Strong correlation between {col1} and {col2}: {correlations[col1][col2]:.2f}")
        
        return insights

# Example usage
if __name__ == "__main__":
    analyzer = HealthDataAnalyzer()
    
    # Mock data
    mock_lab_data = [
        {'glucose': 95, 'hb1ac': 5.2, 'cholesterol': 180},
        {'glucose': 110, 'hb1ac': 6.1, 'cholesterol': 220},
        {'glucose': 88, 'hb1ac': 4.9, 'cholesterol': 160}
    ]
    
    results = analyzer.analyze_lab_results(mock_lab_data)
    insights = analyzer.generate_insights(results)
    
    print("Analysis Results:")
    print(json.dumps(results, indent=2))
    print("\nInsights:")
    for insight in insights:
        print(f"- {insight}")
