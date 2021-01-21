# Autodesk Forge Demo
This app demonstrates the ability to fetch auth services and data from Autodesk's Forge platform.

## Installation Prerequisites

### Docker and `docker-compose`
The package runs in a [Docker](https://www.docker.com/) container, specifically with `docker-compose`. In order to run the software, you _must_ have Docker and `docker-compose` installed
#### For Windows
[Download Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows) for Windows. This will install both Docker and `compose`
#### For Mac
[Download Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-mac/) for Mac. This will install Docker, `compose`, Docker command line, and Docker Notary
#### For Linux (Ubuntu)
1. Set up the repository
    * `$ sudo apt-get update`
    * `$ sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common`
    * `$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
    * `$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"`
       * You can substitute `arch=amd64` with `arch=armhf` or `arch=arm64` based on your architecture
2. Install Docker Engine
   * ` $ sudo apt-get update`
   * `$ sudo apt-get install docker-ce docker-ce-cli containerd.io`
3. Test the installation
   * `sudo docker run hello-world`
   * If installed correctly, you will see an informational message, and the program will exit
4. Install `docker-compose`
   * `sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
       * You can substitute `1.27.4` with the version of `compose` you want to use
   * `sudo chmod +x /usr/local/bin/docker-compose`
   * Test that the installation has succeeded with `docker-compose --version`

## Installation instructions & initial setup
1. Clone the repository with `git clone 'https://tfs.inl.gov/tfs/DICE/NRIC%20Digital%20Engineering/forge-apps'`
1. Enter the `forge-apps` project directory in a terminal, command line, or PowerShell window
1. `docker-compose build`
1. `docker-compose up`

#### Connecting to Autodesk Cloud/Forge apps
You can create a Forge app (start [here](https://forge.autodesk.com/developer/getting-started) for more information), and copy the `CLIENT_ID` and `CLIENT_SECRET` to this library's `api.env`.
