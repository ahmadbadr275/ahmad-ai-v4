/* ---------- ELEMENTS ---------- */
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const colorPicker = document.getElementById("colorInput");

/* ---------- REPLIES WITH EMOJIS ---------- */
const replies = {
  "hi": "Hello! 👋",
  "hii": "Hello! 👋",
  "hello": "Hi there! 🙂",
  "hey": "Hey! 😃",
  "how are you": "I'm good, thank you! 🙂",
  "how r u": "I'm good, thank you! 🙂",
  "how are u": "I'm good, thank you! 🙂",
  "what's up": "Not much, just chatting with you! 😄",
  "thanks": "You're welcome! 🙏",
  "thank you": "No problem! 👍",
  "thx": "No problem! 👍",
  "ok": "Ok ✅",
  "wok": "Ok ✅",
  "yes": "Great! 🎉",
  "yess": "Great! 🎉",
  "no": "Alright. ⚠️",
  "noo": "Alright. ⚠️",
  "bye": "Goodbye! 👋",
  "goodbye": "See you later! 👋",
  "who are you": "I am Ahmad AI 🤖",
  "play chess": "Opening chess board... ♟️",
  "مرحبا": "أهلاً! 👋",
  "أهلا": "أهلاً! 👋",
  "هلا": "أهلاً! 👋",
  "السلام عليكم": "وعليكم السلام! ✋",
  "كيف حالك": "أنا بخير! 🙂",
  "كيف الحال": "أنا بخير! 🙂",
  "تمام": "أنا بخير! 🙂",
  "شكرا": "على الرحب والسعة! 🙏",
  "شكرًا": "على الرحب والسعة! 🙏",
  "مع السلامة": "إلى اللقاء! 👋",
  "باي": "إلى اللقاء! 👋"
};

/* ---------- FALLBACKS ---------- */
const fallbackEN = ["I don't know that yet. 🤔", "Interesting! Tell me more…", "Can you explain differently?"];
const fallbackAR = ["لا أعرف ذلك بعد. 🤔", "مثير للاهتمام، أخبرني أكثر…"];

/* ---------- START CHAT ---------- */
function startChat() {
  addMessage("ai", "Hello! مرحبا! 👋");
}

/* ---------- SEND MESSAGE ---------- */
async function sendMessage() {
  let text = userInput.value.trim();
  if (text === "") return;

  addMessage("user", text);
  let clean = text.toLowerCase().replace(/[?.!,]/g, "");

  let mathResult = safeMath(clean);
  if (mathResult !== null) {
    typingEffect(mathResult);
    userInput.value = "";
    return;
  }

  let reply = null;
  for (let key in replies) {
    if (clean.includes(key)) {
      reply = replies[key];
      break;
    }
  }

  if (!reply) {
    const wikiTriggersEN = ["who is", "what is", "tell me about"];
    const wikiTriggersAR = ["من هو", "ما هو", "حدثني عن"];
    const shouldWiki = wikiTriggersEN.some(k => clean.startsWith(k)) ||
                       wikiTriggersAR.some(k => clean.startsWith(k));
    if (shouldWiki) {
      reply = await searchWikipedia(clean);
    }
  }

  if (!reply) {
    reply = /[ء-ي]/.test(clean) ?
      fallbackAR[Math.floor(Math.random() * fallbackAR.length)] :
      fallbackEN[Math.floor(Math.random() * fallbackEN.length)];
  }

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

/* ---------- SAFE MATH PARSER ---------- */
function safeMath(text) {
  try {
    let expr = text
      .replace("what is", "")
      .replace("plus", "+")
      .replace("minus", "-")
      .replace(/times|multiplied by|x/g, "*")
      .replace(/divided by|over/g, "/")
      .replace(/زائد/g, "+")
      .replace(/ناقص/g, "-")
      .replace(/ضرب|×/g, "*")
      .replace(/قسمة|÷/g, "/");
    expr = expr.replace(/[^0-9+\-*/().\s]/g, "");
    if (/^[0-9+\-*/().\s]+$/.test(expr)) {
      return "Answer: " + Function('"use strict";return (' + expr + ')')();
    }
  } catch { return null; }
  return null;
}

/* ---------- WIKIPEDIA SEARCH WITH FALLBACK ---------- */
async function searchWikipedia(question) {
  let query = question
    .replace(/who is|what is|tell me about|من هو|ما هو|حدثني عن/gi, "")
    .replace(/\b(a|an|the)\b/gi, "")
    .trim();

  const isArabic = /[ء-ي]/.test(query);
  const lang = isArabic ? "ar" : "en";

  // try summary directly
  const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
  try {
    let response = await fetch(summaryUrl);
    let data = await response.json();
    if (data.extract) return data.extract;
  } catch {}

  // fallback: search for best title
  try {
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    let res2 = await fetch(searchUrl);
    let json = await res2.json();
    if (json.query && json.query.search && json.query.search.length > 0) {
      let bestTitle = json.query.search[0].title;
      const bestUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`;
      let resp3 = await fetch(bestUrl);
      let bestData = await resp3.json();
      if (bestData.extract) return bestData.extract;
    }
  } catch {}

  return isArabic ?
    "لم أتمكن من العثور على معلومات." :
    "I couldn't find information.";
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
