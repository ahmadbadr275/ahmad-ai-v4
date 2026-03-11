// ---------- ELEMENTS ----------
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const colorPicker = document.getElementById("colorInput");

// ---------- REPLIES ----------
const replies = {
  // English
  "hi":"Hello!",
  "hello":"Hi there!",
  "hey":"Hey!",
  "ok":"Ok",
  "thanks":"You're welcome!",
  "thank you":"No problem!",
  "bye":"Goodbye!",
  "who are you":"I am Ahmad AI.",
  "play chess":"Opening chess board...",
  
  // Arabic
  "مرحبا":"أهلاً!",
  "السلام عليكم":"وعليكم السلام!",
  "كيف حالك":"أنا بخير!",
  "شكرا":"على الرحب والسعة!",
  "مع السلامة":"إلى اللقاء!"
};

// ---------- FALLBACKS ----------
const fallbackEN = ["I don't know that yet.","Interesting! Tell me more.","Can you explain differently?"];
const fallbackAR = ["لا أعرف ذلك بعد.","مثير للاهتمام، أخبرني أكثر."];

// ---------- START CHAT ----------
function startChat() {
  addMessage("ai", "Hello! مرحبا!");
}

// ---------- SEND MESSAGE ----------
async function sendMessage() {
  let text = userInput.value.trim();
  if (text === "") return;
  
  addMessage("user", text);
  let clean = text.toLowerCase();

  // --- Check math ---
  let mathResult = checkMath(clean);
  if (mathResult) {
    typingEffect(mathResult);
    userInput.value = "";
    return;
  }

  // --- Predefined replies ---
  let reply = null;
  for (let key in replies) {
    if (clean.includes(key)) {
      reply = replies[key];
      break;
    }
  }

  // --- Wikipedia search ---
  if (!reply) {
    if (clean.startsWith("who is") || clean.startsWith("what is") || clean.startsWith("tell me about")) {
      reply = await searchWikipedia(clean);
    }
  }

  // --- Fallback messages ---
  if (!reply) {
    if (/[ء-ي]/.test(clean)) {
      reply = fallbackAR[Math.floor(Math.random() * fallbackAR.length)];
    } else {
      reply = fallbackEN[Math.floor(Math.random() * fallbackEN.length)];
    }
  }

  // --- Typing animation with thinking delay ---
  setTimeout(() => { typingEffect(reply); }, 500);

  if (clean.includes("play chess")) embedChess();

  userInput.value = "";
}

// ---------- ADD MESSAGE ----------
function addMessage(type, text) {
  let msg = document.createElement("div");
  msg.classList.add("message", type);

  if (/[ء-ي]/.test(text)) msg.style.direction = "rtl";

  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------- TYPING EFFECT ----------
function typingEffect(reply) {
  let msg = document.createElement("div");
  msg.classList.add("message", "ai");

  // Typing dots animation
  msg.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    msg.innerText = reply;
  }, 1000);
}

// ---------- CLEAR CHAT ----------
function clearChat() {
  chatBox.innerHTML = "";
}

// ---------- CHANGE BACKGROUND ----------
function changeBackground() {
  document.body.style.backgroundColor = colorPicker.value;
}

// ---------- MATH CHECK ----------
function checkMath(text) {
  let mathText = text
    .replace("what is", "")
    .replace("plus", "+")
    .replace("minus", "-")
    .replace("times", "*")
    .replace("multiplied by", "*")
    .replace("x", "*")
    .replace("divided by", "/")
    .replace("over", "/");

  if (/^[0-9+\-*/().\s]+$/.test(mathText)) {
    try {
      return "Answer: " + eval(mathText);
    } catch {
      return null;
    }
  }
  return null;
}

// ---------- WIKIPEDIA SEARCH ----------
async function searchWikipedia(question) {
  let query = question
    .replace("who is", "")
    .replace("what is", "")
    .replace("tell me about", "")
    .trim();

  const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(query);

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.extract) return data.extract;
    return "I couldn't find information.";
  } catch {
    return "Error searching.";
  }
}

// ---------- EMBED CHESS ----------
function embedChess() {
  const old = document.getElementById("chessFrame");
  if (old) old.remove();

  let iframe = document.createElement("iframe");
  iframe.id = "chessFrame";
  iframe.src = "https://www.chess.com/play/computer";
  iframe.style.width = "100%";
  iframe.style.height = "650px";
  iframe.style.border = "none";
  iframe.style.marginTop = "15px";

  chatBox.appendChild(iframe);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------- ENTER KEY SEND ----------
function enterSend(e) {
  if (e.key === "Enter") sendMessage();
}
