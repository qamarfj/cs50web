import os
import datetime

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    print("index call")
    return render_template("index.html")


@socketio.on("user connected")
def userConnected():
    print('newuser conncted')


@socketio.on("mew message")
def vote(data, methods=['GET', 'POST']):
    userName = data["userName"]
    newMessage = data["newMessage"]

    currentTime = datetime.datetime.now().strftime("%H:%M:%S")
    serverData = {'userName': userName, 'newMessage': newMessage,
                  'currentTime': currentTime}

    print("submit vote call: ", data)
    emit("announce message", serverData, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
