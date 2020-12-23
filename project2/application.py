import os
import datetime

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit, join_room, rooms

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
    channel = data["activechanel"]
    join_room(channel)
    print('newuser login')
    userName = data["userName"]
    newMessage = "has join room "+channel
    currentTime = datetime.datetime.now().strftime("%H:%M:%S")
    serverData = {'userName': userName, 'newMessage': newMessage,
                  'messagetTime': currentTime}

    emit("announce login", serverData, room=channel)


@socketio.on("handshake")
def handshake(data):
    channel = data["activechanel"]
    join_room(channel)
    print('newuser login')
    userName = data["userName"]
    newMessage = "has join room "+channel
    currentTime = datetime.datetime.now().strftime("%H:%M:%S")
    serverData = {'userName': userName, 'newMessage': newMessage,
                  'messagetTime': currentTime}
    messages.append(serverData)
    emit("announce login", serverData, room=channel)


@socketio.on("mew message")
def vote(data, methods=['GET', 'POST']):
    userName = data["userName"]
    newMessage = data["newMessage"]
    channel = data["activechanel"]
    currentTime = datetime.datetime.now().strftime("%H:%M:%S")
    serverData = {'userName': userName, 'newMessage': newMessage,
                  'messagetTime': currentTime}
    messages.append(serverData)
    print("submit vote call: ", data)
    emit("announce message", messages, room=channel)


if __name__ == '__main__':
    socketio.run(app, debug=True)
