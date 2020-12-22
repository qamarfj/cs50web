import os
import datetime

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
users = []  # each element is {username:username,activechanle:chanlename}
# each elemet is {chanelname:chanlename, users:[] each elemnt is username } in activechanel
activechanel = []
messages = []  # each element {user:usernaem, message:textmessage}


@app.route("/")
def index():
    print("index call")
    return render_template("index.html")


@socketio.on("login")
def login(data):
    users.append(data["userName"])
    print('newuser login')
    emit("announce message", messages, broadcast=True)


@socketio.on("handshake")
def handshake(data):
    user = data["userName"]
    activechanel = data["activechanel"]
    emit("announce message", messages, broadcast=True)


@socketio.on("mew message")
def vote(data, methods=['GET', 'POST']):
    userName = data["userName"]
    newMessage = data["newMessage"]

    currentTime = datetime.datetime.now().strftime("%H:%M:%S")
    serverData = {'userName': userName, 'newMessage': newMessage,
                  'messagetTime': currentTime}
    messages.append(serverData)
    print("submit vote call: ", data)
    emit("announce message", messages, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
