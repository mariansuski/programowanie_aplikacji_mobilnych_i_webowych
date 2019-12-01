FROM nginx

COPY . /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

#FROM python:3
#EXPOSE 5000

#WORKDIR /var/www

#RUN pip install --upgrade pip

#COPY musthave musthave
#RUN pip install -r musthave

#COPY . .

#ENV FLASK_APP run.py
#ENV FLASK_RUN_HOST 0.0.0.0

#CMD ["flask", "run"]
