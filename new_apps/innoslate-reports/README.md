# Reports Generator
This repo contains utilities to generate documents that serve the needs of engineering groups, such as requirements management documents. The reports generator takes structured data (JSON) and creates a report in either Word or PDF, with different format templates and formatting options.
## Installation Prerequisites
The package runs in a [Docker](https://www.docker.com/) container, specifically with `docker-compose`. In order to run the software, you _must_ have Docker and `docker-compose` installed.
### For Windows
[Download Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows) for Windows. This will install both Docker and `compose`
### For Mac
[Download Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-mac/) for Mac. This will install Docker, `compose`, Docker command line, and Docker Notary.
### For Linux (Ubuntu)
1. Set up the repository
    * `$ sudo apt-get update`
    * `$ sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common`
    * `$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
    * `$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"`
       * You can substitute `arch=amd64` with `arch=armhf` or `arch=arm64` based on your architecture.
2. Install Docker Engine
   * ` $ sudo apt-get update`
   * `$ sudo apt-get install docker-ce docker-ce-cli containerd.io`
3. Test the installation
   * `sudo docker run hello-world`
   * If installed correctly, you will see an informational message, and the program will exit.
4. Install `docker-compose`
   * `sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
       * You can substitute `1.27.4` with the version of `compose` you want to use.
   * `sudo chmod +x /usr/local/bin/docker-compose`
   * Test that the installation has succeeded with `docker-compose --version`
## Installation instructions.
1. Clone the repository with `git clone 'https://hpcgitlab.inl.gov/harrbk2/reports-generator'`
2. Log in to [nricinnoslate.inl.gov](http://nricinnoslate.inl.gov/) and get an API key.
    * Access your user profile in Innoslate (if you don't have an Innoslate account, contact Brennan Harris [brennan.harris@inl.gov] to get an account)
    * Generate an API key, and copy the highlighted text that appears.
    * Create a file called `api.env` and add the line `REPORTS_KEY=#####` and replace `#####` with the API key you retrieved from Innoslate.
    * Add the file to the `reports-generator` directory
2. Enter the project directory in a terminal, command line, or PowerShell window
3. `docker-compose build`
4. `docker-compose up`

## Running the reports generator
Navigate in a browser to `localhost:8001/ui` to begin generating reports from the Innoslate documents. Look at the routes in `app.js` to access custom API calls.
