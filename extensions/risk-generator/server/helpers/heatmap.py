import pandas as pd

likelihood = ['None', 'Very Unlikely', 'Unlikely', '50/50', 'Likely', 'Very Likely']
impact = ['None', 'Negligible', 'Marginal', 'Significant', 'Critical/Exceptional', 'Crisis/Outstanding']

data = [
    ['None', 'None', 'None', 'None', 'None', 'None'],
    ['None', 'Low', 'Low', 'Low', 'Low', 'Low'],
    ['None', 'Low', 'Low', 'Moderate', 'Moderate', 'High'],
    ['None', 'Low', 'Low', 'Moderate', 'High', 'High'],
    ['None', 'Low', 'Moderate', 'Moderate', 'High', 'High'],
    ['None', 'Low', 'Moderate', 'High', 'High', 'High']
]

heatmap = pd.DataFrame(data, impact, likelihood)
