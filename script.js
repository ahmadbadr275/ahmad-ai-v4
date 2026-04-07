// --------------------- AhmadAI REAL AI Chatbot ---------------------

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const colorPicker = document.getElementById("colorInput");

// --------------------- Memory ---------------------
let chatHistory = []; // keeps track of conversation

// --------------------- Start Chat ---------------------
function startChat(){
    addMessage("ai","Hello! 👋 Ask me anything.");
}

// --------------------- Send Message ---------------------
async function sendMessage(){
    let text = userInput.value.trim();
    if(text === "") return;

    addMessage("user", text);
    chatHistory.push({ role: "user", content: text });

    // AI response
    let reply = await getAIResponse(chatHistory);

    addAIMessage(reply);
    chatHistory.push({ role: "assistant", content: reply });

    userInput.value = "";
}

// --------------------- Add AI Message with Typing Effect ---------------------
function addAIMessage(reply){
    let msg = document.createElement("div");
    msg.classList.add("message","ai");
    msg.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(()=>{
        msg.innerText = reply;
    }, 900);
}

// --------------------- Add User Message ---------------------
function addMessage(type, text){
    let msg = document.createElement("div");
    msg.classList.add("message", type);

    // handle Arabic RTL
    if(/[ء-ي]/.test(text)){
        msg.style.direction = "rtl";
    }

    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --------------------- Clear Chat ---------------------
function clearChat(){
    chatBox.innerHTML = "";
    chatHistory = [];
}

// --------------------- Change Background ---------------------
function changeBackground(){
    document.body.style.backgroundColor = colorPicker.value;
}

// --------------------- Enter Key Support ---------------------
function enterSend(e){
    if(e.key === "Enter"){
        sendMessage();
    }
}

// --------------------- OpenAI API Call ---------------------
async function getAIResponse(chatHistory){
    const API_KEY = "YOUR_API_KEY_HERE"; // <-- REPLACE WITH YOUR OPENAI API KEY

    try{
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // fast, cost-efficient model
                messages: [
                    { role: "system", content: "You are Ahmad AI, a smart, friendly assistant. Respond in a human, natural way." },
                    ...chatHistory
                ],
                max_tokens: 300
            })
        });

        const data = await res.json();
        return data.choices[0].message.content;
    } catch(err){
        console.error(err);
        return "Oops! Something went wrong 🤖";
    }
}

// --------------------- Optional: Safe Math (still works) ---------------------
function safeMath(text){
    try{
        let expr = text
            .replace("what is","")
            .replace("plus","+")
            .replace("minus","-")
            .replace(/times|multiplied by|x/g,"*")
            .replace(/divided by|over/g,"/")
            .replace(/زائد/g,"+")
            .replace(/ناقص/g,"-")
            .replace(/ضرب/g,"*")
            .replace(/قسمة/g,"/");

        expr = expr.replace(/[^0-9+\-*/().\s]/g,"");

        if(/^[0-9+\-*/().\s]+$/.test(expr)){
            return "Answer: " + Function('"use strict";return (' + expr + ')')();
        }
    } catch(e){ return null; }

    return null;
}

// --------------------- Optional: Wikipedia fallback ---------------------
async function searchWikipedia(question){
    let query = question.replace(/who|what|where|when|why|how|which|define|tell me|is|are|ما|من|أين|متى|لماذا/gi,"").trim();
    let isArabic = /[ء-ي]/.test(query);
    let lang = isArabic ? "ar" : "en";

    try{
        let searchURL = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        let res = await fetch(searchURL);
        let data = await res.json();

        if(data.query.search.length > 0){
            let title = data.query.search[0].title;
            let summaryURL = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(title)}&format=json&origin=*`;
            let res2 = await fetch(summaryURL);
            let data2 = await res2.json();
            let page = Object.values(data2.query.pages)[0];
            if(page.extract){
                return page.extract.slice(0, 300) + "...";
            }
        }
    } catch(e){
        console.error(e);
    }

    return isArabic ? "لم أجد معلومات" : "I couldn't find information.";
}
