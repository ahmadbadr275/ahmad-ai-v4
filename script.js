const chatBox = document.getElementById("chatBox");

const replies = {

"hi":"Hello!",
"hello":"Hi there!",
"hey":"Hey!",
"how are you":"I'm doing great!",
"who are you":"I am Ahmad AI, a simple web AI.",
"what is ai":"AI means Artificial Intelligence.",
"what can you do":"I can chat with you and let you play chess.",
"bye":"Goodbye!",
"thanks":"You're welcome!",
"thank you":"No problem!",
"good morning":"Good morning!",
"good night":"Good night!",
"what is your name":"My name is Ahmad AI.",
"who made you":"I was created by a developer.",
"tell me a joke":"Why do programmers prefer dark mode? Because light attracts bugs.",
"help":"You can chat with me or type 'play chess'."

};

const fallbackReplies = [
"Interesting! Tell me more.",
"That sounds interesting.",
"I'm not sure about that yet.",
"Can you explain more?",
"Tell me something else."
];

function startChat(){
addMessage("ai","Hello! How can I help you today?");
}

function sendMessage(){

let input=document.getElementById("userInput");

let text=input.value.trim().toLowerCase();

if(text==="") return;

addMessage("user",text);

let reply=findReply(text);

typingEffect(reply);

input.value="";
}

function findReply(text){

text=text.replace(/[?.!,]/g,"");

for(let key in replies){
if(text.includes(key)){
return replies[key];
}
}

if(text.includes("play chess")){
playChess();
return "Opening chess game...";
}

return fallbackReplies[Math.floor(Math.random()*fallbackReplies.length)];
}

function addMessage(type,text){

let msg=document.createElement("div");

msg.classList.add("message",type);

msg.innerText=text;

chatBox.appendChild(msg);

chatBox.scrollTop=chatBox.scrollHeight;

}

function typingEffect(reply){

let msg=document.createElement("div");

msg.classList.add("message","ai");

msg.innerText="Typing...";

chatBox.appendChild(msg);

chatBox.scrollTop=chatBox.scrollHeight;

setTimeout(()=>{
msg.innerText=reply;
},600);

}

function clearChat(){
chatBox.innerHTML="";
}

function changeBackground(){

let color=document.getElementById("colorInput").value;

document.body.style.backgroundColor=color;

}

function enterSend(event){

if(event.key==="Enter"){
sendMessage();
}

}

function playChess(){

let chessArea=document.getElementById("chessArea");

if(!chessArea){

chessArea=document.createElement("div");

chessArea.id="chessArea";

chessArea.style.marginTop="25px";

chessArea.style.textAlign="center";

document.body.appendChild(chessArea);

}

chessArea.innerHTML = `
<h2>Chess Game</h2>
<iframe 
src="https://www.chess.com/play/computer"
width="650"
height="650"
style="border:none;border-radius:10px;">
</iframe>
`;

}
