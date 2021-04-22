FROM python:3.9.2-alpine

WORKDIR /api

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "app.py"]