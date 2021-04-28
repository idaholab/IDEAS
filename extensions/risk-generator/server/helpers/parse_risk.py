
from datetime import datetime
import time

def parse_risks(data):

    """
        Clean the data and format it into a risk dictionary used to build the .xlsx
    """

    # Time Conversions
    last_date_evaluated_timestamp = int(data['modified'] / 1000)
    last_date_evaluated = datetime.fromtimestamp(last_date_evaluated_timestamp)

    date_risk_opened_timestamp = int(data['created'] / 1000)
    date_risk_opened = datetime.fromtimestamp(date_risk_opened_timestamp)

    risk = {
        'risk_id': data['id'],
        'revision': data['version'],
        'last_date_evaluated': last_date_evaluated,
        'status': data['attrs']['51'],
        'schedule_id': "",
        'watch_list': "",
        'risk_owner': data['attrs']['93'],
        'risk_title': data['name'],
        'project': data['projectId'],
        'risk_statement': data['attrs']['48'],
        'risk_assumptions': "",
        'type': data['type'],
        'risk_breakdown_structure': data['risk_breakdown_structure'],
        'risk_sub_category': data['risk_sub_category'],
        'date_risk_identified': "",
        'date_risk_opened': date_risk_opened,
        'date_risk_closes': "",
        'impacted_wbs_elements': data['impacted_wbs_elements'],
        'secondary_risks': "",
        'initial_risk_likelihood': data['initial_risk_likelihood'],
        'trigger_event': data['attrs']['90'],
        'residual_risk_likelihood': data['residual_risk_likelihood'],
        'initial_consequence': data['initial_consequence'],
        'handling_strategy': data['handling_strategy'],
        'residual_consequence': data['residual_consequence'],
        'initial_risk_rating': "",
        'handling_strategy_implementation_cost': "",
        'residual_risk_rating': "",
        'initial_impact': "",
        'residual_impact': "",
        'initial_schedule_impact': "",
        'residual_schedule_impact': "",
        'basis_of_residual_impact': "",
        'handling_actions': data['attrs']['92'],
        'success_metric': "",
        'status_comments': "",
        'historical_comments': ""
    }

    return risk
    
