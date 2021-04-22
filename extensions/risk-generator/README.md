# NRIC Project Risk Assessment Generator

## Prerequisites
This application requires a local Python 3 installation, and the virtualenv package for development.

## Getting Setup 
If you don't have `virtualenv` you will need to `pip install virtualenv`. 

1. `cd risk-generator` and `python -m virtualenv .` Note the `.` used to specify that you want virtualenv to create the environment in the current directory.
2. Activate your virtual environment by utilizing the newly added Scripts, run `Scripts/activate.ps1`.
3. Create a .env file and configure it according to the .env-sample file.
4. `pip install -r requirements.txt`
5. `python app.py`
6. Navigate to localhost:5000/entities/`projID` to view an Innoslate project's risk data collected and built from the API. 

## Docker-Compose
1. `cd risk-generator` then `docker-compose build` and `docker-compose up`.
2. Navigate to localhost:5000/entities/`projID` to view an Innoslate project's risk data collected and built from the API. 

## .xlsx
Currently only projects with risk entities will return data. Development project is #49.
The risk assessment form is named `risk-assessment-form.xlsx` and generated in the working directory.