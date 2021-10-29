# Flask
from flask import Flask, request, Response
from flask_cors import CORS

# Subprocess
import shlex, subprocess
from subprocess import Popen, PIPE
import json

# Command to be executed by pptruser on the Paged alpine-linux box
command = 'sh paged.sh'

app = Flask(__name__)
app.debug = True
cors = CORS(app)

@app.route('/healthcheck', methods=['GET'])
def get():
    return "OK"

@app.route('/paged', methods=['POST'])
def pandoc():
    print("Generating pdf", flush=True)
    filename = request.get_json().get('id')

    if filename is not None:
        
        process = subprocess.Popen(f'pagedjs-cli ../server/generator/files/{filename}.html --additional-script ../server/generator/files/paged/tableOfContents.js --additional-script ../server/generator/files/paged/handler.js -o ../server/generator/files/{filename}.pdf', shell=True, stdout=PIPE, stderr=PIPE)
        output, error = process.communicate()
        if process.returncode != 0:
            print(process.returncode, flush=True)
            return error

    return "OK"

@app.route('/preview', methods=['GET'])
def preview():

    print("Generating preview", flush=True)
    process = subprocess.Popen('pagedjs-cli ../server/generator/files/preview/preview.html --additional-script ../server/generator/files/paged/tableOfContents.js --additional-script ../server/generator/files/paged/handler.js -o ../server/generator/files/preview/preview.pdf', shell=True, stdout=PIPE, stderr=PIPE)
    output, error = process.communicate()
    if process.returncode != 0:
        print(process.returncode, flush=True)
        return error
    
    return "OK"


app.run(host='0.0.0.0', port=5001)