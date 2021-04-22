# Flask
from flask import Flask, request, jsonify, safe_join, send_from_directory, abort
import requests
import sys
from flask_cors import CORS

app = Flask(__name__)
app.debug = True
cors = CORS(app, resources={r"*": {"origins": "*"}})

# Evnironment
from dotenv import load_dotenv
import os

load_dotenv()
host=os.environ.get("FLASK_HOST")
data_host = os.environ.get("INNOSLATE_HOST")
key = os.environ.get("INNOSLATE_KEY")

# Excel Writer
import xlsxwriter

# Helpers
from helpers.parse_risk import parse_risks # Transforms the risk dictionary into NRIC format
from helpers.build_xls import build_xls # Writes data to the .xlsx

# Routes
@app.route('/entities/<projectId>', methods=['POST'])
def risks(projectId):

    filename = request.get_json().get("fileName")+'.xlsx'
    workbook = xlsxwriter.Workbook(f'reports/{filename}')
    

    r = requests.get(
        data_host+"/o/nric/entities", 
        params={"query": "class:Risk", "projectId": projectId}, 
        headers={
            "Authorization": f'basic {key}',
            "User-Agent": "Docker"
            }
        )

    data = r.json()
    if (len(data) == 0):
        abort(404)

    try: 
        # For each risk, generate a new risk assessment form in the workbook
        for risk_data in data:
            generate(workbook, risk_data)
        
        workbook.close()
    except:
        abort(500)


    path = safe_join('reports')
    return send_from_directory(path, filename, as_attachment=True)



@app.route('/innoslate/projects', methods=['GET'])
def projects():

    r = requests.get(
        data_host+"/o/nric/p",
        headers={
            "Authorization": f'basic {key}',
            "User-Agent": "Docker"
            }
        )

    my_keys = ("id", "name", "description")
    
    data = r.json()
    projects = []

    for project in data:
        new_project = {key: project.get(key) for key in my_keys}
        projects += [new_project]

    return jsonify(projects)


def generate(workbook, risk_data):
    risk_object = parse_risks(risk_data)
    build_xls(workbook, risk_object)

if __name__ == '__main__':
    app.run(host=host)