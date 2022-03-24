# IDEAS

Ion Digital Engineering Application Suite. Apps, adapters, and utilities created by or in conjunction with researchers in the Digital Engineering (B710) department

One of the tool sponsors is the National Reactor Innovation Center [(NRIC)](https://www.energy.gov/sites/prod/files/2019/08/f65/NRIC_Fact_Sheet.pdf)

The NRIC Digital Engineering Ecosystem is a software suite designed to eliminate procedural failures in the engineering lifecycle of complex projects. It focuses on improving the flow of scheduling data, safety information, engineering requirements, and CAD files among stakeholders of complex engineering projects. The project comprises software adapters that move engineering data from disparate software tools in and out of a central database. The ecosystem is designed to efficiently incorporate data sources from many different engineering toolsets, making it software agnostic, and adaptable to many different engineering applications.

### Other Software
Idaho National Laboratory is a cutting edge research facility which is a constantly producing high quality research and software. Feel free to take a look at our other software and scientific offerings at:

[Primary Technology Offerings Page](https://www.inl.gov/inl-initiatives/technology-deployment)

[Supported Open Source Software](https://github.com/idaholab)

[Raw Experiment Open Source Software](https://github.com/IdahoLabResearch)

[Unsupported Open Source Software](https://github.com/IdahoLabCuttingBoard)

## Installation and use
This toolset is bundled as a `docker-compose` project.
1. Install or update [Docker Desktop](https://www.docker.com/products/docker-desktop) on your computer.
1. Clone this project to a home directory: git clone `https://gitlab.software.inl.gov/b650/nric-de`
1. Rename the file .env-sample to .env in the `core` directory
1. Any variable represented with the value `####` should be reset by the user
1. Open a terminal in the project's `core` directory
1. Launch the command docker-compose build. This may take a few minutes to initially build the image.
1. Launch the command docker-compose up. This should execute quickly.

## Applications

The applications that are available in the project are split. Their Vue-based UI elements live in the `/core` directory, specifically at `/core/src/views/subviews/applications`. Any corresponding backend microservices for these apps can be found in the `/new_apps` directory, with each application microservice contained in its own subdirectory.

### Manufacturing
This is an application for defining and editing the representations of advanced manufacturing processes. Its development is being funded by the INL LDRD Advanced Material Property Prediction through Digital Twins

### Vault API
This library uses the Autodesk Vault SOAP API to make Vault Client actions accessible to JavaScript. See the directory README for more information and build instructions.

### Windchill utilities
This application makes automation actions available to users who have `Basic` type Windchill credentials to execute bulk actions on directories in Windchill containers

## Adapters

### Deep Lynx
This is a Deep Lynx client to execute bundled actions to the Deep Lynx API. This adapter may become redundant if the [Deep Lynx JS SDK](https://www.npmjs.com/package/deep-lynx-sdk) is implemented correctly through the app.

### Autodesk Vault
This adapter pulls CAD files and associated metadata from NRIC's cloud instance of Autodesk Vault. The user must supply a valid username and password as a set in a `Basic` auth header.

### Innoslate
This adapter allows requirement data to be pushed from Deep Lynx to Innoslate.

### Windchill
This adapter allows custom actions to be performed on a PTC Windchill instance. It is used by the frontend Vue component in the Windchill subview.

## License

Copyright 2021 Battelle Energy Alliance, LLC

Licensed under the MIT (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.



Licensing
-----
This software is licensed under the terms you may find in the file named "LICENSE" in this directory.


Developers
-----
By contributing to this software project, you are agreeing to the following terms and conditions for your contributions:

You agree your contributions are submitted under the MIT license. You represent you are authorized to make the contributions and grant the license. If your employer has rights to intellectual property that includes your contributions, you represent that you have received permission to make contributions and grant the required license on behalf of that employer.
