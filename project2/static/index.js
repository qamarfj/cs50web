document.addEventListener("DOMContentLoaded", () => {
  //username is saved then remove login section
  const loginDiv = document.getElementById("login");
  let userName = localStorage.getItem("userName");
  if (userName) loginDiv.remove();

  // Connect to websocket
  // @ts-ignore
  const socket = io.connect("http://" + document.domain + ":" + location.port);

  // When connected, configure buttons
  socket.on("connect", function () {
    //anouse user connection
    //if user exists
    function handshake() {
      //const activeChannel = localStorage.get("activeChannel");
      socket.emit("handshake", {
        userName: userName,
        //activechanel: activeChannel,
      });
    }
    //login function
    function login() {
      document.getElementById("btn-login").addEventListener("click", () => {
        userName = document.getElementById("user-name").value;
        localStorage.setItem("userName", userName);
        //call to login
        socket.emit("login", {
          userName: userName,
        });
        //remove login section
        loginDiv.remove();
      });
    }
    if (userName) {
      handshake();
    } else {
      login();
    }

    document.getElementById("send-button").addEventListener("click", () => {
      console.log("lin12 button clicked");
      //const userNameInput = document.getElementById("user-name");
      const newMessageInput = document.getElementById("new-message");
      const clientData = {
        userName: userName,
        newMessage: newMessageInput.value,
      };

      socket.emit("mew message", clientData);
      console.log("lin21 emit");
      newMessageInput.value = "";
      newMessageInput.focus();
    });
    // When a new message is announced, add to the unordered list
    socket.on("announce message", function (data) {
      console.log(data);
      if (data.length > 0) {
        const h3 = document.getElementById("h3");
        if (h3) h3.remove();
      }
      const ul = document.getElementById("UL");
      while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }

      data.forEach((serverData) => {
        const newLi = document.createElement("li");
        newLi.textContent = `${serverData.userName} said: ${serverData.newMessage} at: ${serverData.messagetTime}`;
        ul.appendChild(newLi);
      });
    });
  });
});
