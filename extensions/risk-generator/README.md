# NRIC Project Risk Assessment Generator

## Prerequisites
This application runs in Docker.

## Getting Setup 

1. Create a .env file and configure it according to the .env-sample file.
2. Navigate to localhost:5000/entities/`projID` to view an Innoslate project's risk data collected and built from the API. 

## Docker-Compose
1. In the `risk-generator` directory run `docker-compose build` and `docker-compose up`.
2. Navigate to localhost:5000/entities/`projID` to view an Innoslate project's risk data collected and built from the API. 

## .xlsx
Currently only projects with risk entities will return data. Development project is #90.
The risk assessment form is named `risk-assessment-form.xlsx` and generated in the working directory.