/* ---------- ELEMENTS ---------- */

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const colorPicker = document.getElementById("colorInput");

/* ---------- REPLIES ---------- */

const replies = {

"hi":"Hello! 👋",
"hello":"Hi there 🙂",
"hey":"Hey 😃",
"how are you":"I'm good, thank you 🙂",
"thanks":"You're welcome 🙏",
"thank you":"No problem 👍",
"ok":"Ok ✅",
"yes":"Great 🎉",
"no":"Alright ⚠️",
"bye":"Goodbye 👋",
"who are you":"I am Ahmad AI 🤖",
"play chess":"Opening chess board ♟️",

"مرحبا":"أهلاً 👋",
"السلام عليكم":"وعليكم السلام ✋",
"كيف حالك":"أنا بخير 🙂",
"شكرا":"على الرحب والسعة 🙏",
"مع السلامة":"إلى اللقاء 👋"

};

/* ---------- FALLBACK ---------- */

const fallbackEN = [
"I couldn't find that information 🤔",
"Interesting question!",
"Try asking in another way"
];

const fallbackAR = [
"لم أجد معلومات عن ذلك 🤔",
"سؤال مثير للاهتمام"
];

/* ---------- START CHAT ---------- */

function startChat(){

addMessage("ai","Hello! مرحبا 👋 Ask me something.");

}

/* ---------- SEND MESSAGE ---------- */

async function sendMessage(){

let text = userInput.value.trim();

if(text==="") return;

addMessage("user",text);

let clean = text.toLowerCase().replace(/[?.!,]/g,"");

let reply = null;

/* ---------- MATH ---------- */

let math = safeMath(clean);

if(math!==null){

typingEffect(math);

userInput.value="";

return;

}

/* ---------- PREDEFINED REPLIES ---------- */

for(let key in replies){

if(clean.includes(key)){

reply = replies[key];

break;

}

}

/* ---------- QUESTION TYPES ---------- */

const wikiTriggersEN = [

"who is",
"what is",
"what are",
"where is",
"when was",
"when did",
"which",
"why is",
"tell me about",
"define"

];

const wikiTriggersAR = [

"من هو",
"ما هو",
"ما هي",
"متى",
"أين",
"لماذا",
"حدثني عن"

];

let useWiki =
wikiTriggersEN.some(q=>clean.startsWith(q)) ||
wikiTriggersAR.some(q=>clean.startsWith(q));

/* ---------- WIKIPEDIA ---------- */

if(!reply && useWiki){

reply = await searchWikipedia(clean);

}

/* ---------- FALLBACK ---------- */

if(!reply){

if(/[ء-ي]/.test(clean)){

reply = fallbackAR[Math.floor(Math.random()*fallbackAR.length)];

}else{

reply = fallbackEN[Math.floor(Math.random()*fallbackEN.length)];

}

}

/* ---------- TYPING ---------- */

setTimeout(()=>typingEffect(reply),500);

if(clean.includes("play chess") || clean.includes("شطرنج")) embedChess();

userInput.value="";

}

/* ---------- ADD MESSAGE ---------- */

function addMessage(type,text){

let msg=document.createElement("div");

msg.classList.add("message",type);

if(/[ء-ي]/.test(text)) msg.style.direction="rtl";

msg.innerText=text;

chatBox.appendChild(msg);

chatBox.scrollTop=chatBox.scrollHeight;

}

/* ---------- TYPING EFFECT ---------- */

function typingEffect(reply){

let msg=document.createElement("div");

msg.classList.add("message","ai");

msg.innerHTML=`<div class="typing"><span></span><span></span><span></span></div>`;

chatBox.appendChild(msg);

chatBox.scrollTop=chatBox.scrollHeight;

setTimeout(()=>{

msg.innerText=reply;

},900);

}

/* ---------- CLEAR CHAT ---------- */

function clearChat(){

chatBox.innerHTML="";

}

/* ---------- BACKGROUND COLOR ---------- */

function changeBackground(){

document.body.style.backgroundColor=colorPicker.value;

}

/* ---------- SAFE MATH ---------- */

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

}catch{

return null;

}

return null;

}

/* ---------- WIKIPEDIA SEARCH ---------- */

async function searchWikipedia(question){

let query=question

.replace(/who is|what is|what are|where is|when was|when did|which|why is|tell me about|define|من هو|ما هو|ما هي|متى|أين|لماذا|حدثني عن/gi,"")

.replace(/\b(a|an|the)\b/gi,"")

.trim();

let isArabic=/[ء-ي]/.test(query);

let lang=isArabic ? "ar":"en";

/* DIRECT PAGE */

try{

let url=`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

let res=await fetch(url);

let data=await res.json();

if(data.extract) return data.extract;

}catch{}

/* SEARCH FALLBACK */

try{

let searchURL=`https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;

let res2=await fetch(searchURL);

let json=await res2.json();

if(json.query.search.length>0){

let title=json.query.search[0].title;

let url2=`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

let res3=await fetch(url2);

let data2=await res3.json();

if(data2.extract) return data2.extract;

}

}catch{}

return isArabic ? "لم أتمكن من العثور على معلومات" : "I couldn't find information";

}

/* ---------- CHESS ---------- */

function embedChess(){

const old=document.getElementById("chessFrame");

if(old) old.remove();

let iframe=document.createElement("iframe");

iframe.id="chessFrame";

iframe.src="https://www.chess.com/play/computer";

iframe.style.width="100%";

iframe.style.height="650px";

iframe.style.border="none";

iframe.style.marginTop="15px";

chatBox.appendChild(iframe);

chatBox.scrollTop=chatBox.scrollHeight;

}

/* ---------- ENTER KEY ---------- */

function enterSend(e){

if(e.key==="Enter") sendMessage();

}
