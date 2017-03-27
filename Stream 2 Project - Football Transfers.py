from flask import Flask
from flask import render_template

app = Flask(__name__)


@app.route('/')
def about():
    return render_template('about.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/trends')
def trends():
    return render_template('trends.html')


if __name__ == '__main__':
    app.run(debug=True)
