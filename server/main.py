# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python37_app]
from flask import Flask, render_template, send_file, request, make_response
import logging
import sys
import os 

def create_flask_app():
	app = Flask(__name__, template_folder="dist")
	app.secret_key = "Super Secret"
	return app

app = create_flask_app()

@app.route('/css/<path:filename>')
def css(filename):
	return send_file(os.path.join(os.getcwd(), "dist/css/%s" % filename))


@app.route('/js/<path:filename>')
def js(filename):
	return send_file(os.path.join(os.getcwd(), "dist/js/%s" % filename))


@app.route('/img/<path:filename>')
def img(filename):
    try:
        if 'favicon' in filename or 'android' in filename:
            return ''
            # return send_file(os.path.join(os.getcwd(), "dist/favicon.png"))
        return send_file(os.path.join(os.getcwd(), "dist/img/%s" % filename))
    except:
        return ''


@app.route('/<path:filename>')
def manifest(filename):
    try:
	    if filename == "manifest.json":
		    return send_file(os.path.join(os.getcwd(), "dist/manifest.json"))
    except:
        return ''

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
	return render_template("index.html")

if __name__ == '__main__':
	# This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(port=3000, debug=True)

# [END gae_python37_app]
