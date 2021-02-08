# Pipeline  
Pipeline is an ETL application designed to configure a "pipeline" for data extraction, transfer, and loading into [Deep-Lynx](https://github.com/idaholab/Deep-Lynx).

## Installation Prerequisites
This application runs in Docker containers, using Docker Compose.

## Installation Instructions
1. Clone the parent repository `git clone https://github.com/idaholab/NRIC-DE.git`.
2. In the `pipeline/server` directory, rename the `.env-sample` file to `.env`.
    * Ensure that your `.gitignore` targets this file. 
    * For each data source, specify a `HOST` and `KEY`. These variables are where your data lives and where you want Pipeline to extract from.
3. In the `pipeline/ui` directory, rename the `.env-sample` file to `.env`.
    * Ensure that your `.gitignore` targets this file. 
    * Configure these environment variables for your Deep-Lynx host and port. This is the destination you want Pipeline to load data.
    * To post data to Deep-Lynx, you will need a bearer token, container, and data source.
4. `cd pipeline/` and `docker-compose build`, then `docker-compose up`.
5. Navigate to http://localhost:8081

