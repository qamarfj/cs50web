document.addEventListener("DOMContentLoaded", () => {
  console.log("lin2");
  // Connect to websocket
  const socket = io.connect("http://" + document.domain + ":" + location.port);
  console.log("lin5 socket created");
  // When connected, configure buttons
  socket.on("connect", function () {
    //anouse user connection
    console.log("lin9 connected");

    document.getElementById("send-button").addEventListener("click", () => {
      console.log("lin12 button clicked");
      const userNameInput = document.getElementById("user-name");
      const newMessageInput = document.getElementById("new-message");
      const clientData = {
        userName: userNameInput.value,
        newMessage: newMessageInput.value,
      };

      socket.emit("mew message", clientData);
      console.log("lin21 emit");
      newMessageInput.value = "";
      newMessageInput.focus();
    });
    // When a new message is announced, add to the unordered list
    socket.on("announce message", function (serverData) {
      console.log(serverData);
      if (typeof serverData.userName !== "undefined") {
        const h3 = document.getElementById("h3");
        if (h3) h3.remove();
      }

      console.log("lin28 data got");
      const ul = document.getElementById("UL");
      const newLi = document.createElement("li");
      newLi.textContent = `${serverData.userName} said: ${serverData.newMessage}`;
      ul.appendChild(newLi);
    });
  });
});
