// --------------------- FULL MAXED-OUT AhmadAI JS ---------------------

// ----- Global Variables -----
let chatBox = document.getElementById("chatBox");
let userInput = document.getElementById("userInput");
let colorPicker = document.getElementById("colorInput");

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;

// ----- Knowledge Library (Expanded) -----
const knowledgeLibrary = {
    "hello":"Hello! 👋 How can I help you today?",
    "hi":"Hi there! 😄",
    "hey":"Hey! 😎",
    "how are you":"I'm great, thanks for asking! 🙂",
    "bye":"Goodbye! 👋 See you later!",
    "thanks":"You're welcome! 🙏",
    "thank you":"No problem! 👍",
    "who is einstein":"Albert Einstein was a German-born theoretical physicist who developed the theory of relativity.",
    "who is newton":"Isaac Newton formulated the laws of motion and universal gravitation.",
    "what is gravity":"Gravity is the force that attracts objects with mass toward each other.",
    "what is photosynthesis":"Photosynthesis is how plants turn sunlight into energy.",
    "what is ai":"AI stands for Artificial Intelligence, machines simulating human intelligence.",
    "what is javascript":"JavaScript is a programming language for interactive websites.",
    "what is python":"Python is a high-level programming language used for many purposes.",
    "what is earth":"Earth is the third planet from the Sun.",
    "what is moon":"The Moon is Earth's natural satellite.",
    "capital of france":"Paris",
    "capital of japan":"Tokyo",
    "capital of egypt":"Cairo",
    "largest ocean":"Pacific Ocean",
    "fastest land animal":"Cheetah",
    "largest mammal":"Blue Whale",
    "who discovered america":"Christopher Columbus",
    "who invented light bulb":"Thomas Edison",
    "what is pi":"Pi is approximately 3.14159",
    "who wrote hamlet":"William Shakespeare",
    "who was the first president of usa":"George Washington",
    "what is bitcoin":"Bitcoin is a digital cryptocurrency.",
    "what is html":"HTML is the markup language for web pages.",
    "what is css":"CSS is used to style HTML pages.",
    "what is democracy":"Democracy is a system of government where people vote.",
    "who is alan turing":"Alan Turing was a mathematician and computer scientist.",
    "what is black hole":"A black hole is a region in space with gravity so strong that nothing can escape it.",
    "what is internet":"The Internet is a global network connecting millions of computers.",
    "what is cloud computing":"Cloud computing is storing and accessing data over the internet instead of your computer.",
    "who is tesla":"Nikola Tesla was an inventor known for AC electricity.",
    "who is marie curie":"Marie Curie was a scientist who studied radioactivity and won 2 Nobel Prizes.",
    "what is dna":"DNA is the molecule that carries genetic instructions in living organisms."
};

// ----- Fallback Replies -----
const fallbackEN = ["I’m not sure yet 😅","Can you rephrase that?","Interesting question!"];
const fallbackAR = ["ممم 🤔 لست متأكداً بعد","لم أفهم تماماً، هل يمكنك التوضيح؟"];

// ----- Authentication Functions -----
function signUpModal(){
    let email = document.getElementById("authEmail").value;
    let password = document.getElementById("authPassword").value;
    if(!email || !password){ alert("Enter email & password!"); return; }
    if(users.find(u => u.email===email)){ alert("Email exists!"); return; }
    users.push({email,password,chat:[]});
    localStorage.setItem("users",JSON.stringify(users));
    alert("Sign up success! Login now.");
    closeModal();
}
function loginModal(){
    let email = document.getElementById("authEmail").value;
    let password = document.getElementById("authPassword").value;
    let user = users.find(u => u.email===email && u.password===password);
    if(!user){ alert("Invalid credentials!"); return; }
    currentUser = user;
    loadChat();
    closeModal();
    alert("Login successful!");
}
function closeModal(){ document.getElementById("authModal").style.display="none"; }

// ----- Send Chat Message -----
function sendMessage(){
    let text = userInput.value.trim();
    if(!text) return;
    addMessage("user", text);
    userInput.value = "";

    // Check Math
    let mathAnswer = safeMath(text);
    if(mathAnswer){ typingEffect(mathAnswer); return; }

    // Knowledge Library Lookup
    let clean = text.toLowerCase();
    let reply = knowledgeLibrary[clean] || fallbackEN[Math.floor(Math.random()*fallbackEN.length)];
    typingEffect(reply);
}

// ----- Add Message to Chat -----
function addMessage(type, text){
    let msg = document.createElement("div");
    msg.classList.add("message", type);
    if(/[ء-ي]/.test(text)) msg.style.direction = "rtl";
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Save to user chat
    if(currentUser){ currentUser.chat.push({type,text}); saveUserChat(); }
}

// ----- Typing Animation -----
function typingEffect(reply){
    let msg = document.createElement("div");
    msg.classList.add("message","ai");
    msg.innerHTML='<div class="typing"><span></span><span></span><span></span></div>';
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(()=>{ msg.innerText=reply; },900);
}

// ----- Save User Chat to LocalStorage -----
function saveUserChat(){
    let index = users.findIndex(u => u.email===currentUser.email);
    if(index!==-1){ users[index]=currentUser; localStorage.setItem("users",JSON.stringify(users)); }
}

// ----- Load User Chat -----
function loadChat(){
    chatBox.innerHTML="";
    if(!currentUser) return;
    currentUser.chat.forEach(m=>addMessage(m.type,m.text));
}

// ----- Math Solver -----
function safeMath(text){
    try{
        let expr = text
            .replace("plus","+").replace("minus","-")
            .replace(/times|multiplied by|x/g,"*")
            .replace(/divided by|over/g,"/")
            .replace(/زائد/g,"+").replace(/ناقص/g,"-")
            .replace(/ضرب/g,"*").replace(/قسمة/g,"/");
        expr = expr.replace(/[^0-9+\-*/().\s]/g,"");
        if(/^[0-9+\-*/().\s]+$/.test(expr)) return "Answer: "+Function('"use strict";return ('+expr+')')();
    } catch(e){ return null; }
    return null;
}

// ----- Event Listeners -----
document.getElementById("sendBtn").addEventListener("click", sendMessage);
userInput.addEventListener("keydown", e=>{ if(e.key==="Enter") sendMessage(); });
colorPicker.addEventListener("input", ()=>{ document.body.style.backgroundColor=colorPicker.value; });

// ----- Initialize -----
document.getElementById("authModal").style.display="flex";
