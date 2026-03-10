const chatBox = document.getElementById("chatBox");

const replies = {
"hi":"Hello!",
"hello":"Hi there!",
"hey":"Hey!",
"ok":"Alright!",
"okay":"Okay!",
"thanks":"You're welcome!",
"thank you":"No problem!",
"bye":"Goodbye!",
"good morning":"Good morning!",
"good night":"Good night!",
"how are you":"I'm doing great!",
"what is ai":"AI means Artificial Intelligence.",
"who made you":"I was created by the developer.",
"who are you":"I am Ahmad AI, a simple chatbot.",
"help":"You can chat with me or generate photos.",
"what can you do":"I can answer simple questions and generate images."
};

function startChat(){
addMessage("ai","Hello! How can I help you today?");
}

function sendMessage(){

let input=document.getElementById("userInput");

let text=input.value.trim();

if(text==="") return;

addMessage("user",text);

let reply=findReply(text);

typingEffect(reply);

input.value="";
}

function findReply(text){

text=text.replace(/[?.!,]/g,"").toLowerCase();

for(let key in replies){

if(text.includes(key)){
return replies[key];
}

}

return "Interesting! Tell me more.";
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

},800);
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

function generateImage(){

let prompt=document.getElementById("imagePrompt").value.trim();

if(prompt==="") return;

let img=document.createElement("img");

img.classList.add("generated");

img.src="https://source.unsplash.com/600x400/?"+encodeURIComponent(prompt);

document.body.appendChild(img);
}
