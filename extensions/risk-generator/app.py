# Flask
from flask import Flask, render_template, request, make_response
import requests
from flask_cors import CORS

app = Flask(__name__)
app.debug = True
cors = CORS(app, resources={r"/entities/*": {"origins": "*"}})

# Evnironment
from dotenv import load_dotenv
import os

load_dotenv()
host=os.environ.get("HOST")
data_host = os.environ.get("INNOSLATE_HOST")
key = os.environ.get("INNOSLATE_KEY")

# Excel Writer
import xlsxwriter

# Helpers
from helpers.parse_risk import parse_risks # Transforms the risk dictionary into NRIC format
from helpers.build_xls import build_xls # Writes data to the .xlsx

# Routes
@app.route('/entities/<projectId>', methods=['GET'])
def risks(projectId):
    workbook = xlsxwriter.Workbook('risk-assessment-form.xlsx')

    r = requests.get(
        data_host+"/o/nric/entities", 
        params={"query": "class:Risk", "projectId": projectId}, 
        headers={
            "Authorization": f'basic {key}',
            "User-Agent": "Flask" # APIs don't like when this header isn't defined, as is the default case in Flask
            }
        )

    data = r.json()

    try: 
        # For each risk, generate a new risk assessment form in the workbook
        for risk_data in data:
            generate(workbook, risk_data)
        
        workbook.close()
    except xlsxwriter.exceptions.DuplicateWorksheetName:
        error = "You have to reload the Flask server to overwrite the same .xlsx. This is a temporary Development restriction"
        print(error)
        return error, 500
    
    response = make_response(render_template("risks.html", data=data))

    workbook.close()

    return response

def generate(workbook, risk_data):
    risk_object = parse_risks(risk_data)
    build_xls(workbook, risk_object)

if __name__ == '__main__':
    app.run(host=host)