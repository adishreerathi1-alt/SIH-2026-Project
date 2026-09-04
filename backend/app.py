from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/")
def home():
    return "SIH26186 Backend is Running!"


@app.route("/personnel", methods=["POST"])
def add_personnel():

    data = request.json

    return jsonify({
        "message": "Personnel data received successfully",
        "data": data
    })


if __name__ == "__main__":
    app.run(debug=True)