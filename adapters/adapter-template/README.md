# Deep Lynx Adapter Template  
This tool is an ETL application template for loading data into [Deep-Lynx](https://github.com/idaholab/Deep-Lynx)

## Installation Prerequisites
This application runs in Docker containers, using Docker Compose

## Installation Instructions
1. Clone the parent repository `git clone https://github.com/idaholab/NRIC-DE.git`.
1. In the `adapters/adapter-template` directory, rename the `.env-sample` file to `.env`
    * Ensure that your `.gitignore` targets this file
1. Set required environment variables in `.env`
    * The following variables can retain their default values, as long as the ports don't conflict with services running in your development environment
      * `VUE_APP_SERVER_HOST`
      * `VUE_APP_SERVER_PORT`
      * `VUE_APP_UI_HOST`
      * `VUE_APP_UI_PORT`
    * The Deep Lynx variables will be based on which instance of the service your connecting to, and the information Deep Lynx served when you set up your user account. Please refer to the [Deep Lynx open source](https://github.com/idaholab/Deep-Lynx) project for installing a development instance for your use
      * `DEEP_LYNX_ADDRESS`: This can be a web address where a development or production instance of Deep Lynx is persistent. If you are accessing Deep Lynx from a docker instance, run `docker inspect <Deep Lynx container-name>` and set the IP address from the variable `NetworkSettings.Networks.deep-lynx_default.Gateway` and the port from `NetworkSettings.Ports.HostPort`
      * `DEEP_LYNX_API_KEY`: one-time string returned when creating an account through the Deep Lynx UI
      * `DEEP_LYNX_API_SECRET`: one-time string returned when creating an account through the Deep Lynx UI
      * `DEEP_LYNX_TOKEN_EXPIRY`: a token duration variable that determines how long the token remains valid. Follows the [vercel/ms](https://github.com/vercel/ms#convert-from-milliseconds) format
    * The datasource variables are set by default to a source of JSON dummy data at [{JSON} Placeholder](https://jsonplaceholder.typicode.com)
      * `DATASOURCE_HOST`: can be set to your unique datasource URL
      * `DATASOURCE_KEY`: placeholder for datasources requiring a Bearer token or other Authorization header

1. In a PowerShell, Command Prompt, or Terminal: `cd adapters/adapter-template` and `docker-compose build`, then `docker-compose up`

## Running the Adapter Service
Navigate to http://localhost:{`VUE_APP_UI_PORT`} and select your source and destination endpoints. For each object, you can 'Push' data into Deep-Lynx

By default, the service is configured to hot reload inside the Docker container, so changes to files in the `/server` and `/ui` directories will trigger a recompile and restart of the web service
