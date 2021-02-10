# Pipeline  
Pipeline is an ETL application designed to configure a "pipeline" for data extraction, transformation, and loading into [Deep-Lynx](https://github.com/idaholab/Deep-Lynx).

## Prerequisites
This application runs in Docker containers, using Docker Compose.

## Getting Setup
1. Clone the parent repository `git clone https://github.com/idaholab/NRIC-DE.git`.
2. In the `pipeline` directory, rename the `.env-sample` file to `.env`.
    * Ensure that the `.gitignore` targets this file. 
    * The Pipeline Container, Adapter Server, Server Container, and Deep Lynx environments are already specified in their recommended configuration.
    * To post data to Deep-Lynx, you will need a bearer token, a container, and a data source.
        - To obtain a bearer token, you will need to authenticate using the `x-api-key` and `x-api-secret` Deep-Lynx generated for you on initial startup. Follow these [instructions](https://github.com/idaholab/Deep-Lynx/wiki/Generating-and-Using-API-Keys).
        - To create a container, you will need to follow these [instructions](https://github.com/idaholab/Deep-Lynx/wiki/Creating-an-Ontology).
        - To initialize a data source, you will need to follow these [instructions](https://github.com/idaholab/Deep-Lynx/wiki/How-to-Ingest-Data).
    * For each data source, specify a `HOST`, and a `KEY` to authenticate Pipeline requests.
4. From the `pipeline` directory, run `docker-compose build`, then `docker-compose up`.

## Running The Application
Navigate to http://localhost:8081 and select your source and destination endpoints. For each object, you can 'Push' data into Deep-Lynx.