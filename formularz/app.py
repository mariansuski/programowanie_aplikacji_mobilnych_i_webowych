from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def start():
    return 'Hello world!'


@app.route('/home')
def home():
    return render_template("home.html")


@app.route('/login')
def login():
    return render_template("login.html")


if __name__ == '__main__':
    app.run()
