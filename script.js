function sendMessage() {
  let input = document.getElementById("userInput");
  let chat = document.getElementById("chatBox");

  if (input.value.trim() === "") return;

  chat.innerHTML += "<p><b>You:</b> " + input.value + "</p>";
  chat.innerHTML += "<p><b>AI:</b> Hello Ahmad! I am your AI.</p>";

  input.value = "";
}

function changeColor() {
  let color = document.getElementById("colorInput").value.toLowerCase();
  document.body.style.background = color;
}

function showChess() {
  document.getElementById("chess").style.display = "block";
}
