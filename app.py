from flask import Flask, render_template
from flask_redis import FlaskRedis

app = Flask(__name__)
redis_client = FlaskRedis(app)


@app.route('/')
def start():
    return render_template("home.html")


if __name__ == '__main__':
    app.run()
