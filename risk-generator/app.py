# Flask
from flask import Flask, render_template, request, make_response
import requests

# Evnironment
from dotenv import load_dotenv
import os
load_dotenv()
host=os.environ.get("HOST")
data_host = os.environ.get("INNOSLATE_HOST")
key = os.environ.get("INNOSLATE_KEY")

# Excel Writer
import xlsxwriter
workbook = xlsxwriter.Workbook('risk-assessment-form.xlsx')

# Helpers
from helpers.risk_enumerators import risk_enumerators # Adds drop-down fields to the risk dictionary
from helpers.parse_risk import parse_risks # Transforms the risk dictionary into NRIC format
from helpers.reference_data import reference_data # Creates the reference data sheet
from helpers.build_xls import build_xls # Writes data to the .xlsx

# Flask
app = Flask(__name__)
app.debug = True
from flask_cors import CORS
cors = CORS(app, resources={r"/entities/*": {"origins": "*"}})


# Routes
@app.route('/entities/<projectId>', methods=['GET'])
def risks(projectId):
    """
        Development view, use project 49 only
        Returns the view in /templates/risks.html
    """

    r = requests.get(
        data_host+"/o/nric/entities", 
        params={"query": "class:Risk", "projectId": projectId}, 
        headers={
            "Authorization": f'basic {key}',
            "User-Agent": "Docker" # APIs don't like when this header isn't defined, as is the default case in Flask
            }
        )

    data = r.json()
    print(data)

    try:   
        # Build a single reference data sheet
        reference_data(workbook)
        # For each risk, generate a new risk assessment form in the workbook
        for risk_data in data:
            generate(risk_data)
        
        workbook.close()
    except xlsxwriter.exceptions.DuplicateWorksheetName:
        error = "You have to reload the Flask server to overwrite the same .xlsx. This is a temporary Development restriction"
        print(error)
        return error, 500

    response = make_response(render_template("risks.html", data=data))

    return response

def generate(risk_data):
    risk_data.update(risk_enumerators)
    risk_object = parse_risks(risk_data)
    build_xls(workbook, risk_object)


if __name__ == '__main__':
    app.run(host=host)