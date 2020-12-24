import os
import datetime

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit, join_room, rooms

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
users = []  # each element is {username:username,activechanle:chanlename}
# each elemet is {chanelname:chanlename, users:[] each elemnt is username } in activechanel
channels = []
messages = {}  # each element {"channel", [textmessage]}


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
    if channel in messages:
        messages[channel].append(serverData)
    else:
        messages[channel] = [serverData]
    if channel not in channels:
        channels.append(channel)

    emit("announce login", serverData, room=channel)
    emit("announce channels", channels,  broadcast=True)


@socketio.on("join channel")
def handshake(data):
    channel = data["activechanel"]
    join_room(channel)
    userName = data["userName"]
    newMessage = "has join room "+channel
    currentTime = datetime.datetime.now().strftime("%H:%M:%S")
    serverData = {'userName': userName, 'newMessage': newMessage,
                  'messagetTime': currentTime}
    if channel in messages:
        messages[channel].append(serverData)
    else:
        messages[channel] = [serverData]
    if channel not in channels:
        channels.append(channel)
    emit("announce login", serverData, room=channel)
    emit("announce channels", channels,  broadcast=True)


@ socketio.on("mew message")
def vote(data, methods=['GET', 'POST']):
    userName = data["userName"]
    newMessage = data["newMessage"]
    channel = data["activechanel"]
    currentTime = datetime.datetime.now().strftime("%H:%M:%S")
    serverData = {'userName': userName, 'newMessage': newMessage,
                  'messagetTime': currentTime}

    if channel in messages:
        messages[channel].append(serverData)
    else:
        messages[channel] = [serverData]
    print("new message call: ", channels)

    emit("announce message", messages[channel], room=channel)
#    emit("announce chanels", channels,  broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
