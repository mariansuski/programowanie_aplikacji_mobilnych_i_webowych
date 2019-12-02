import os

from flask import render_template, request, redirect
from werkzeug.utils import secure_filename

from app import app


@app.route('/')
def index():
    return render_template("index.html")


def allowed_file(filename):
    if not "." in filename:
        return False

    ext = filename.rsplit(".", 1)[1]

    if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False


def allowed_filesize(filesize):
    if int(filesize) <= app.config["MAX_IMAGE_FILESIZE"]:
        return True
    else:
        return False


@app.route('/upload', methods=["GET", "POST"])
def upload():
    if request.method == "POST":

        if request.files:

            if "filesize" in request.cookies:

                if not allowed_filesize(request.cookies["filesize"]):
                    print("Filesize exceeded maximum limit")
                    return redirect(request.url)

                image = request.files["image"]

                if image.filename == "":
                    print("No filename")
                    return redirect(request.url)

                if allowed_file(image.filename):
                    filename = secure_filename(image.filename)

                    image.save(os.path.join(app.config["IMAGE_UPLOADS"], filename))

                    print("Image saved")

                    return redirect(request.url)

                else:
                    print("That file extension is not allowed")
                    return redirect(request.url)
    return render_template("upload.html")


@app.route('/register')
def register():
    return render_template("register.html")
