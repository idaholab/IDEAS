# Autodesk Vault JavaScript Utilities
This library uses the Autodesk Vault SOAP API to make Vault Client actions accessible to JavaScript

## Installation Prerequisites
### Autodesk Vault
This software package requires the Autodesk Data Management Server to be running on the computer where it is deployed. The ADMS is bundled with the Professional version of [Autodesk Vault](https://www.autodesk.com/products/vault/subscribe?plc=VLTM&term=1-YEAR&support=ADVANCED&quantity=1)

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
1. Clone the repository with `git clone 'https://tfs.inl.gov/tfs/DICE/NRIC%20Digital%20Engineering/adskvault-js'`
1. Navigate in a file explorer to `C:\Program Files\Autodesk\ADMS Professional 20##\Server\Web\Services`
1. There should be several directories named in the format `v##`
1. Check that the latest version (e.g. `v25`) matches the latest version included in the services variable found in this package's `api.env` file. If not, update the environment variables in the file to match the latest version found in the `Web\Services` directory
1. Launch the Autodesk Data Management Server in Windows, and log in with the admin account
1. Create a vault, and at least one user profile. Remember the vault name, the username, and the password
1. Enter the `adskvault-js` project directory in a terminal, command line, or PowerShell window
1. `docker-compose build`
1. `docker-compose up`

## Running the reports generator
1. Navigate in a browser to `localhost:8002/`
1. Click the `GET SOAP DATA` button
1. Click `AUTHSERVICE`
1. Launch the `SIGNIN` function with 'dataServer' set to `localhost`, and the other values you set when you created a user and vault in ADMS
1. Once you've signed in, you'll see `SOAP TOKEN` and `SOAP USER ID` appear on the page that will persist and allow you to launch any of the other functions in Vault that require them
1. Open the functions of a service by clicking on any of the `VAULT SOAP SERVICES`
1. Functions that require a single layer of input data will create fields for you to fill. Functions that require nested data will populate a text area with a placeholder data structure that you can experiment with
