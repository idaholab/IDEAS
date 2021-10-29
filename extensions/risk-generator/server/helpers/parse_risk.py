
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
        'basis_of_residual_impact': data['attrs'].get('495'),
        'date_risk_closes': date_risk_closes,
        'date_risk_identified': date_risk_identified,
        'date_risk_opened': date_risk_opened,
        'handling_actions': data['attrs'].get('92'),
        'handling_strategy': data['attrs'].get('91'),
        'handling_strategy_implementation_cost': data['attrs'].get('501'),
        'historical_comments': data['attrs'].get('498'),
        'impacted_wbs_elements': data['attrs'].get('553'),
        'initial_consequence': data['attrs'].get('486'),
        'initial_impact': data['attrs'].get('491'),
        'initial_risk_likelihood': data['attrs'].get('485'),
        'initial_schedule_impact': data['attrs'].get('493'),
        'last_date_evaluated': last_date_evaluated,
        'project': data.get('projectID'),
        'residual_consequence': data['attrs'].get('490'),
        'residual_impact': data['attrs'].get('492'),
        'residual_risk_likelihood': data['attrs'].get('488'),
        'residual_schedule_impact': data['attrs'].get('494'),
        'revision': data.get('version'),
        'risk_assumptions': data['attrs'].get('475'),
        'risk_breakdown_structure': data['attrs'].get('479'),
        'risk_id': data.get('id'),
        'risk_number': data.get('number'),
        'risk_owner': data['attrs'].get('93'),
        'risk_statement': data['attrs'].get('48'),
        'risk_sub_category': data['attrs'].get('554'),
        'risk_title': data.get('name'),
        'schedule_id': data['attrs'].get('476'),
        'secondary_risks': data['attrs'].get('484'),
        'status': data['attrs'].get('51'),
        'status_comments': data['attrs'].get('497'),
        'success_metric': data['attrs'].get('496'),
        'trigger_event': data['attrs'].get('487'),
        'type': data['attrs'].get('478'),
        'watch_list': data['attrs'].get('477'),
    }

    return risk
