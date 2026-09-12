from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


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


@app.route("/api/v1/scan/summary", methods=["POST"])
def scan_summary():
    """Wellness scans are designed to stay on-device. This endpoint refuses media."""
    data = request.json or {}
    if data.get("video") or data.get("audio") or data.get("transcript") or data.get("note"):
        return jsonify({
            "error": "Rejected. Do not upload video, audio, transcripts, or journal text.",
        }), 400
    return jsonify({
        "accepted": False,
        "message": "Face, voice, and NLP run in the browser. Server storage is disabled for confidentiality.",
    }), 200


@app.route('/api/v1/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    return jsonify({
        "total_monitored": 5248,
        "units_count": 18,
        "elevated_risk_count": 224,
        "risk_trajectory_score": 64.8,
        "trajectory_change_pct": 8.4
    }), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
