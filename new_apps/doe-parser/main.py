from app import app
import os
from dotenv import load_dotenv
#from helpers import *
load_dotenv()
DOEPARSER_PORT= os.getenv('DOEPARSER_PORT')

if __name__ == '__main__':
    #Start Flask server
    app.run(debug = False, host='0.0.0.0', port=DOEPARSER_PORT)
