// ================== CHAT & AI ==================
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const colorPicker = document.getElementById("colorInput");

// Predefined replies
const replies = {
  // English
  "hi":"Hello 👋",
  "hello":"Hi there 🙂",
  "hey":"Hey!",
  "how are you":"I'm good 🙂",
  "ok":"Ok ✅",
  "yes":"Great!",
  "no":"Alright",
  "thanks":"You're welcome 🙏",
  "thank you":"No problem 👍",
  "bye":"Goodbye 👋",
  "who are you":"I am Ahmad AI 🤖",
  
  // Arabic
  "مرحبا":"أهلاً 👋",
  "السلام عليكم":"وعليكم السلام",
  "كيف حالك":"أنا بخير 🙂",
  "شكرا":"على الرحب والسعة",
  "مع السلامة":"إلى اللقاء 👋",
  "أهلا":"أهلاً 👋",
  "كيف الحال":"أنا بخير 🙂",
  "من أنت":"أنا أحمد AI 🤖"
};

// Fallbacks
const fallbackEN = ["I couldn't find information.","Interesting question!","Try asking another way."];
const fallbackAR = ["لم أجد معلومات عن ذلك","سؤال مثير للاهتمام"];

// Chess variables
let board = null;
let game = new Chess();

// ================== CHAT FUNCTIONS ==================
function startChat(){
  addMessage("ai","Hello! 👋 Ask me something or type 'play chess' / 'العب شطرنج'.");
}

async function sendMessage(){
  let text = userInput.value.trim();
  if(text==="") return;
  addMessage("user", text);
  let clean = text.toLowerCase().replace(/[?.!,]/g,"");

  // ---------- CHESS TRIGGER FIRST ----------
  if(/\b(play chess|chess)\b/i.test(clean) ||
     /شطرنج/.test(clean) ||
     /العب شطرنج/.test(clean) ||
     /ابدأ شطرنج/.test(clean)) {
       initChess();
       userInput.value = "";
       return; // stop further replies
  }

  let reply = null;

  // ---------- PREDEFINED REPLIES ----------
  for(let key in replies){
    if(clean.includes(key)){ reply = replies[key]; break; }
  }

  // ---------- MATH ----------
  let math = safeMath(clean);
  if(math !== null){ reply = math; }

  // ---------- WIKIPEDIA ----------
  const wikiTriggers = ["who","what","where","when","why","how","which","define","tell me","ما","من","أين","متى","لماذا"];
  let useWiki = wikiTriggers.some(q => clean.startsWith(q));
  if(!reply && useWiki){ reply = await searchWikipedia(clean); }

  // ---------- FALLBACK ----------
  if(!reply){
    if(/[ء-ي]/.test(clean)){
      reply = fallbackAR[Math.floor(Math.random()*fallbackAR.length)];
    } else {
      reply = fallbackEN[Math.floor(Math.random()*fallbackEN.length)];
    }
  }

  setTimeout(()=>typingEffect(reply), 500);
  userInput.value = "";
}

// Display messages with correct text direction
function addMessage(type,text){
  let msg = document.createElement("div");
  msg.classList.add("message",type);
  msg.style.direction = /[ء-ي]/.test(text) ? "rtl" : "ltr";
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function typingEffect(reply){
  let msg = document.createElement("div");
  msg.classList.add("message","ai");
  msg.innerHTML='<div class="typing"><span></span><span></span><span></span></div>';
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  setTimeout(()=>{ msg.innerText=reply; },900);
}

function clearChat(){ chatBox.innerHTML=""; }
function changeBackground(){ document.body.style.backgroundColor=colorPicker.value; }

// ================== MATH ==================
function safeMath(text){
  try{
    let expr=text
      .replace("what is","")
      .replace("plus","+")
      .replace("minus","-")
      .replace(/times|multiplied by|x/g,"*")
      .replace(/divided by|over/g,"/")
      .replace(/زائد/g,"+")
      .replace(/ناقص/g,"-")
      .replace(/ضرب/g,"*")
      .replace(/قسمة/g,"/");
    expr=expr.replace(/[^0-9+\-*/().\s]/g,"");
    if(/^[0-9+\-*/().\s]+$/.test(expr)){
      return "Answer: "+Function('"use strict";return ('+expr+')')();
    }
  }catch(e){ return null; }
  return null;
}

// ================== WIKIPEDIA SEARCH ==================
async function searchWikipedia(question){
  let query = question.replace(/who|what|where|when|why|how|which|define|tell me|is|are|ما|من|أين|متى|لماذا/gi,"").trim();
  let isArabic = /[ء-ي]/.test(query);
  let lang = isArabic ? "ar" : "en";
  try{
    let searchURL = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    let res = await fetch(searchURL);
    let data = await res.json();
    if(data.query.search.length>0){
      let title = data.query.search[0].title;
      let summaryURL = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(title)}&format=json&origin=*`;
      let res2 = await fetch(summaryURL);
      let data2 = await res2.json();
      let page = Object.values(data2.query.pages)[0];
      if(page.extract) return page.extract;
    }
  }catch(e){ console.error(e); }
  return isArabic ? "لم أجد معلومات" : "I couldn't find information.";
}

// ================== CHESS ==================
function initChess(){
  addMessage("ai","Chess started! ♟️ Drag your piece to move. AI will respond.");
  // Clear previous board
  document.getElementById("chessBoardContainer").innerHTML = '<div id="chessBoard"></div>';
  game.reset();
  const config = {
    draggable:true,
    position:'start',
    onDrop:function(source,target){
      let move = game.move({from:source,to:target,promotion:'q'});
      if(move===null) return 'snapback';
      setTimeout(makeAIMove,400);
    }
  };
  board = Chessboard('chessBoard',config);
}

function makeAIMove(){
  let moves = game.moves();
  if(moves.length===0) return;
  let move = moves[Math.floor(Math.random()*moves.length)];
  game.move(move);
  board.position(game.fen());
}

// ================== ENTER KEY ==================
function enterSend(e){ if(e.key==="Enter") sendMessage(); }
