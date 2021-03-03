# Pipeline  
Pipeline is an ETL application designed to configure a "pipeline" for data extraction, transformation, and loading into [Deep-Lynx](https://github.com/idaholab/Deep-Lynx).

## Prerequisites
This application runs in Docker containers, using Docker Compose.

## Getting Setup
1. Clone the parent repository `git clone https://github.com/idaholab/NRIC-DE.git`.
2. In the `pipeline` directory, rename the `.env-sample` file to `.env`.
    * Ensure that the `.gitignore` targets this file. 
    * The Pipeline Container, Adapter Server, Server Container, and Deep Lynx environments are already specified in their recommended configuration.
    * To post data to Deep-Lynx, you will need to set the `VUE_APP_DEEP_LYNX_X_API_KEY` and `VUE_APP_DEEP_LYNX_X_API_SECRET` variables. Deep-Lynx provides you these values on initial startup.
    * For each data source, specify a `HOST`, and a `KEY` to authenticate Pipeline requests.
4. From the `pipeline` directory, run `docker-compose build`, then `docker-compose up`.

## Running The Application
Navigate to http://localhost:8081 and select your source and destination endpoints. For each object, you can 'Push' data into Deep-Lynx.