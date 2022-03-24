import os
import sys
import tempfile as tf
import datetime
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from helpers import get_csv, get_obj

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify([{"message": "This is the DOE document parsing service."}])

@app.route('/health')
def health():
    return jsonify([{"value": "OK"}])

@app.route('/convert/<filetype>', methods=['POST'])
def upload_files(filetype):
    print(request.files, file=sys.stdout)
    uploaded_file = request.files['file']
    filename = secure_filename(uploaded_file.filename)
    if filename != '':
        with tf.TemporaryDirectory() as tdir:
            pathname=os.path.join(tdir, filename)
            uploaded_file.save(pathname)
            if filetype == 'csv':
                response = get_csv(pathname)
                if response:
                    new_filename = filename.replace('.docx', '.csv')
                    return send_file(pathname.replace('.docx', '.csv'), as_attachment=True, attachment_filename=new_filename)
            elif filetype == 'obj':
                rows = get_obj(pathname)
                return jsonify({"rows": rows})
    return jsonify({"status": "failed"})
