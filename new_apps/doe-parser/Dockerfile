FROM python:3.8-alpine3.14

LABEL Paul Plachinda <paul.plachinda@inl.gov>

#RUN apt-get update -y
#RUN apt-get upgrade -y
#RUN apt-get install -y python3-pip python3-dev

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app
RUN mkdir /uploads
