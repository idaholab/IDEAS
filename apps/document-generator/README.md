# Document Generator

The Doge application takes model based system engineering (MBSE) data from Deep Lynx and generates styled PDF documents.

## Getting Started

You will need to configure your `.env` with a Deep Lynx API key and secret.

### Starting Doge

This application runs in Docker.
Enter the root directory and run `docker-compose build` and then `docker-compose up`.

## Using the Application

If MBSE data exists in Deep Lynx, you can query the documents and see the application return them to the front-end in the form of a default styled PDF.
Alternatively, you can define a style template, and watch in real-time as the template is applied to a lorem-ipsum document.
