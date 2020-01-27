from flask import (
    Flask,
    Blueprint,
    request,
    Response,
    render_template,
    redirect,
    url_for,
    make_response,
    send_file,
)
import jwt
import os
import glob
from app.pythoning.user import User
from app.pythoning.database import Users

REDIS_URL = os.environ['REDIS_URL']
SECRET_KEY = "kluczyk"
UPLOADS_PATH = os.path.join(os.path.dirname(__file__), "files")
DOWNLOADS_PATH = "files"

users = Users(REDIS_URL)

app = Flask(__name__)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html"), 200


@app.route("/login", methods=["GET"])
def login():
    return render_template("login.html"), 200


@app.route("/register", methods=["GET"])
def register():
    return render_template("register.html"), 200


@app.route("/validate_credentials", methods=["POST"])
def validate_credentials():
    form = request.form
    try:
        login = form["login"]
        password = form["password"]
    except KeyError:
        return redirect(url_for("login"))

    user = users.get(login)
    if user.login is None:
        return render_template("login.html", error="Invalid login"), 401

    if user.password != password:
        return render_template("login.html", error="Invalid password"), 401

    token = jwt.encode({"login": login}, SECRET_KEY, algorithm="HS256")

    response = make_response(redirect(f"user/{user.login}"))
    response.set_cookie("jwtToken", token, max_age=90)
    users.update(user.login, {"token": token})

    return response


@app.route("/create_user", methods=["POST"])
def create_user():
    form = request.form
    try:
        users.add(
            User(
                form["first_name"],
                form["last_name"],
                form["password"],
                form["birth_date"],
                form["login"],
                form["pesel"],
                form["sex"],
            )
        )
    except KeyError:
        return redirect(url_for("register"))
    return redirect(url_for("index"))


@app.route("/user/<name>", methods=["GET"])
def user(name):
    user = users.get(name)
    if user.login is None:
        return Response(status=404)
    elif "jwtToken" in request.cookies:
        token = request.cookies.get("jwtToken")
        try:
            login = jwt.decode(token, SECRET_KEY)["login"]
            if user.login == login and user.token == token:
                files = glob.glob(os.path.join(UPLOADS_PATH, f"{login}_*.pdf"))
                print(files)
                files = [path.split("_", 1)[-1] for path in files]
                response = make_response(
                    render_template("user.html", user=user, files=files), 200
                )
                return response
            else:
                return Response(
                    render_template("error.html", error="Invalid token"), status=200
                )
        except KeyError:
            return Response(
                render_template("error.html", error="Invalid token"), status=200
            )
    else:
        return Response(
            render_template(
                "error.html", error="User exists, but you are not authenticated"
            ),
            status=200,
        )


@app.route("/upload", methods=["POST"])
def upload():
    try:
        file = request.files["file"]
    except KeyError:
        return Response(render_template("error.html", error="Invalid form"), status=409)

    if "jwtToken" in request.cookies:
        token = request.cookies.get("jwtToken")
        login = jwt.decode(token, SECRET_KEY)["login"]

        if users.get(login).token == token:
            if file.filename.endswith(".pdf"):
                if not os.path.isdir(UPLOADS_PATH):
                    os.makedirs(UPLOADS_PATH)
                file.save(os.path.join(UPLOADS_PATH, f"{login}_{file.filename}"))
                return redirect(f"user/{login}")
            else:
                return Response(
                    render_template("error.html", error="Invalid file"), status=409
                )
        else:
            return Response(
                render_template("error.html", error="Invalid token"), status=409
            )
    else:
        return Response(render_template("error.html", error="No token"), status=409)

    return redirect(url_for("index"))


@app.route("/file-download/<filename>", methods=["GET"])
def file_download(filename):
    if "jwtToken" in request.cookies:
        token = request.cookies.get("jwtToken")
        login = jwt.decode(token, SECRET_KEY)["login"]

        if users.get(login).token == token:
            name = filename

            return send_file(
                os.path.join(DOWNLOADS_PATH, f"{login}_{filename}"),
                attachment_filename=name,
                as_attachment=True,
            )
        else:
            return Response(
                render_template("error.html", error="Invalid token"), status=403
            )
    else:
        return Response(render_template("error.html", error="No token"), status=403)


@app.route("/logout", methods=['GET'])
def logout():
    if "jwtToken" in request.cookies:
        token = request.cookies.get("jwtToken")
        login = jwt.decode(token, SECRET_KEY)["login"]

        if users.get(login).token == token:
            users.delete(login, 'token')

    response = make_response(redirect(url_for('index')))
    response.set_cookie('jwtToken', '', expires=0)

    return response


@app.route("/account", methods=['GET'])
def account():
    if "jwtToken" in request.cookies:
        token = request.cookies.get("jwtToken")
        login = jwt.decode(token, SECRET_KEY)["login"]

        if users.get(login).token == token:
            return redirect(f"user/{login}")
    return redirect(url_for('login'))


if __name__ == "__main__":
    users.add(User(
        "Adam",
        "Suski",
        "admin",
        "10-10-2010",
        "admin",
        "222222222222",
        "M",
    ))
    app.run(host="0.0.0.0", port=5000)
