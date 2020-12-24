document.addEventListener("DOMContentLoaded", () => {
  //username is saved then remove login section
  const loginDiv = document.getElementById("login");
  let userName = localStorage.getItem("userName");
  let activeChannel = localStorage.getItem("activeChannel");
  if (userName) loginDiv.remove();
  else document.getElementById("create-channel").hidden = true;

  // Connect to websocket
  // @ts-ignore
  const socket = io.connect("http://" + document.domain + ":" + location.port);

  // When connected, configure buttons
  socket.on("connect", function () {
    //anouse user connection
    //if user does not  exists
    function login() {
      if (!userName) {
        document.getElementById("btn-login").addEventListener("click", () => {
          const user = document.getElementById("user-name").value;
          const channelName = document.getElementById("user-channel").value;
          //store in local
          localStorage.setItem("userName", user);
          localStorage.setItem("activeChannel", channelName);
          //assign to variables
          userName = user;
          activeChannel = channelName;
          //call to login
          //remove login section
          loginDiv.remove();
          document.getElementById("create-channel").hidden = false;
        });
      }

      socket.emit("login", {
        userName: userName,
        activechanel: activeChannel,
      });
    }
    login();
    document.getElementById("btn-create").addEventListener("click", () => {
      const channelInput = document.getElementById("input-channel");
      const channel = channelInput.value;
      localStorage.setItem("activeChannel", channel);
      activeChannel = channel;
      socket.emit("create channel", {
        userName: userName,
        activechanel: activeChannel,
      });
      channelInput.value = "";
    });
    document.getElementById("send-button").addEventListener("click", () => {
      console.log("lin12 button clicked");
      //const userNameInput = document.getElementById("user-name");
      const newMessageInput = document.getElementById("new-message");
      const clientData = {
        userName: userName,
        newMessage: newMessageInput.value,
        activechanel: activeChannel,
      };

      socket.emit("mew message", clientData);
      console.log("lin21 emit");
      newMessageInput.value = "";
      newMessageInput.focus();
    });

    // When a new login is announced, add to the unordered list
    socket.on("announce login", function (serverData) {
      console.log(serverData);

      const h3 = document.getElementById("h3");
      if (h3) h3.remove();
      const ul = document.getElementById("UL");
      const newLi = document.createElement("li");
      newLi.textContent = `${serverData.userName} : ${serverData.newMessage} at: ${serverData.messagetTime}`;
      ul.appendChild(newLi);
    });
    ///listernerr to channels
    function addlistenertochannels() {
      const listitems = document.querySelectorAll(".channel");
      listitems.forEach((chanel) =>
        chanel.addEventListener("dblclick", function () {
          const channel = this.innerHTML;
          localStorage.setItem("activeChannel", channel);
          activeChannel = channel;
          socket.emit("join channel", {
            userName: userName,
            activechanel: activeChannel,
          });
        })
      );
    }
    //new channel anouse
    // When a new message is announced, add to the unordered list
    socket.on("announce channels", function (channels) {
      const listitems = document.querySelectorAll(".channel");
      if (listitems.length > 0) {
        listitems.forEach((chanel) =>
          chanel.removeEventListener("dblclick", function () {})
        );
      }
      const channelsList = document.getElementById("channel-list");
      while (channelsList.firstChild) {
        channelsList.removeChild(channelsList.firstChild);
      }
      channels.forEach((channel) => {
        const newLi = document.createElement("li");
        newLi.className = "channel";
        newLi.textContent = `${channel}`;
        channelsList.appendChild(newLi);
      });
      addlistenertochannels();
    });

    // When a new message is announced, add to the unordered list
    socket.on("announce message", function (messages) {
      const ul = document.getElementById("UL");
      while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }
      messages.forEach((serverData) => {
        const newLi = document.createElement("li");
        newLi.textContent = `${serverData.userName} said: ${serverData.newMessage} at: ${serverData.messagetTime}`;
        ul.appendChild(newLi);
      });
    });
  });
});
