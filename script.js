/* ---------- ELEMENTS ---------- */
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const colorPicker = document.getElementById("colorInput");

/* ---------- REPLIES WITH EMOJIS ---------- */
const replies = {
  // English greetings & small talk
  "hi":"Hello! 👋",
  "hii":"Hello! 👋",
  "hello":"Hi there! 🙂",
  "hey":"Hey! 😃",
  "how are you":"I'm good, thank you! 🙂",
  "how r u":"I'm good, thank you! 🙂",
  "how are u":"I'm good, thank you! 🙂",
  "what's up":"Not much, just chatting with you! 😄",
  "thanks":"You're welcome! 🙏",
  "thank you":"No problem! 👍",
  "thx":"No problem! 👍",
  "ok":"Ok ✅",
  "wok":"Ok ✅",
  "yes":"Great! 🎉",
  "yess":"Great! 🎉",
  "no":"Alright. ⚠️",
  "noo":"Alright. ⚠️",
  "bye":"Goodbye! 👋",
  "goodbye":"See you later! 👋",
  "who are you":"I am Ahmad AI 🤖",
  "play chess":"Opening chess board... ♟️",

  // Arabic greetings & small talk
  "مرحبا":"أهلاً! 👋",
  "أهلا":"أهلاً! 👋",
  "هلا":"أهلاً! 👋",
  "السلام عليكم":"وعليكم السلام! ✋",
  "كيف حالك":"أنا بخير! 🙂",
  "كيف الحال":"أنا بخير! 🙂",
  "تمام":"أنا بخير! 🙂",
  "شكرا":"على الرحب والسعة! 🙏",
  "شكرًا":"على الرحب والسعة! 🙏",
  "مع السلامة":"إلى اللقاء! 👋",
  "باي":"إلى اللقاء! 👋"
};

/* ---------- FALLBACKS ---------- */
const fallbackEN = ["I don't know that yet. 🤔","Interesting! Tell me more…","Can you explain differently?"];
const fallbackAR = ["لا أعرف ذلك بعد. 🤔","مثير للاهتمام، أخبرني أكثر…"];

/* ---------- START CHAT ---------- */
function startChat() {
  addMessage("ai", "Hello! مرحبا! 👋");
}

/* ---------- SEND MESSAGE ---------- */
async function sendMessage() {
  let text = userInput.value.trim();
  if (text === "") return;

  addMessage("user", text);
  let clean = text.toLowerCase();

  // --- Check math ---
  let mathResult = safeMath(clean);
  if (mathResult !== null) {
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
    if (clean.startsWith("who is") || clean.startsWith("what is") || clean.startsWith("tell me about") ||
        clean.startsWith("من هو") || clean.startsWith("ما هو") || clean.startsWith("حدثني عن")) {
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

  // --- Typing animation ---
  setTimeout(() => { typingEffect(reply); }, 500);

  if (clean.includes("play chess") || clean.includes("شطرنج")) embedChess();

  userInput.value = "";
}

/* ---------- ADD MESSAGE ---------- */
function addMessage(type, text) {
  let msg = document.createElement("div");
  msg.classList.add("message", type);

  if (/[ء-ي]/.test(text)) msg.style.direction = "rtl";

  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* ---------- TYPING EFFECT ---------- */
function typingEffect(reply) {
  let msg = document.createElement("div");
  msg.classList.add("message", "ai");
  msg.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  setTimeout(() => { msg.innerText = reply; }, 1000);
}

/* ---------- CLEAR CHAT ---------- */
function clearChat() { chatBox.innerHTML = ""; }

/* ---------- CHANGE BACKGROUND ---------- */
function changeBackground() { document.body.style.backgroundColor = colorPicker.value; }

/* ---------- SAFE MATH PARSER (EN + AR) ---------- */
function safeMath(text) {
  try {
    let expr = text.toLowerCase()
      .replace("what is","")
      .replace("plus","+")
      .replace("minus","-")
      .replace(/times|multiplied by|x/g,"*")
      .replace(/divided by|over/g,"/")
      // Arabic math
      .replace(/زائد/g,"+")
      .replace(/ناقص/g,"-")
      .replace(/ضرب|×/g,"*")
      .replace(/قسمة|÷/g,"/");
    
    expr = expr.replace(/[^0-9+\-*/().\s]/g,""); // remove unsafe chars
    if (/^[0-9+\-*/().\s]+$/.test(expr)) {
      return "Answer: " + Function('"use strict";return ('+expr+')')();
    }
  } catch { return null; }
  return null;
}

/* ---------- WIKIPEDIA SEARCH (EN + AR) ---------- */
async function searchWikipedia(question) {
  let query = question
    .replace(/who is|what is|tell me about|من هو|ما هو|حدثني عن/gi,"")
    .trim();

  const isArabic = /[ء-ي]/.test(query);
  const url = (isArabic ? "https://ar.wikipedia.org/api/rest_v1/page/summary/" : "https://en.wikipedia.org/api/rest_v1/page/summary/") 
              + encodeURIComponent(query);

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.extract) return data.extract;
    return isArabic ? "لم أتمكن من العثور على معلومات." : "I couldn't find information.";
  } catch {
    return isArabic ? "حدث خطأ في البحث." : "Error searching.";
  }
}

/* ---------- EMBED CHESS ---------- */
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

/* ---------- ENTER KEY SEND ---------- */
function enterSend(e) {
  if (e.key === "Enter") sendMessage();
}
