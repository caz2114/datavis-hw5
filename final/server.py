from flask import Flask
from flask import render_template
from flask import Response, request, jsonify

import re
app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template('home.html')

@app.route('/temp')
def temp():
    return render_template('temp.html')

if __name__ == '__main__':
   app.run(debug = True)
