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
workbook = xlsxwriter.Workbook('risk-assessment-form.xls')

# Helpers
from helpers.risks import parse_risks
from helpers.enumerators import risk_enumerators
from helpers.xls import build_xls
from helpers.reference_data import reference

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

    data = r.json()[0] # Development only, for projects with only one risk entity (#49)
    data.update(risk_enumerators)
    response = make_response(render_template("risks.html", data=data))

    requests.post("http://localhost:5000/generate", json=data, headers={'Content-Type': 'application/json'})

    return response


@app.route('/generate', methods=['POST'])
def generate():

    """
        Accepts Innoslate data, parses it into a risk object, and sends it to a .xls builder
    """

    data = request.get_json()
    

    risk = parse_risks(data)

    build_xls(workbook, risk)
    reference(workbook)
    workbook.close()

    return "OK"


if __name__ == '__main__':
    app.run(host=host)