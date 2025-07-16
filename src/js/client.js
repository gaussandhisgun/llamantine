import { Ollama } from 'https://esm.run/ollama/browser'

const converter = new showdown.Converter()

var host = localStorage.getItem("host")
if (host == null || host == undefined) {
	host = prompt("Enter your Ollama host and port (it will be saved)", "http://127.0.0.1:11434")
}
localStorage.setItem("host", host)

const ollama = new Ollama({ host: host })
const sendbutton = document.getElementById("send")
const msg = document.getElementById("message")
const modelpicker = document.getElementById("modelpicker")
const chatview = document.getElementById("messages")
const chatlist = document.getElementById("chatlist")
const newbutton = document.getElementById("new-chat")

var msgid = 0
var current_chat = 0
var chats = []
chats[current_chat] = []

function setChat(id) {
	console.log("setChat(" + id + ")")
	current_chat = id
	loadChat(id)
	updateChatList()
}

function setupChatSwitcher(a, k) {
	console.log(a)
	console.log(k)
	a.onclick = function() {
		setChat(k);
	}
}

function updateChatList() {
	chatlist.innerHTML = ""
	for (let i in chats) {
		var classes = "chat_switcher"
		if (i.toString() == current_chat.toString()) {
			classes += ' active_chat'
		}
		var name
		if (chats[i][0] != undefined) {name = chats[i][0].content} else {name = "Empty Chat"}
		chatlist.innerHTML += '<li class="cs_container"><button class="' + classes + '" id="chat' + i + '">' + name + '</button></li>'
	}
	for (let i in chats) {
		const c = document.getElementById("chat"+i)
		setupChatSwitcher(c, i)
	}
} 

function newChat() {
	current_chat = chats.length
	chats[current_chat] = []
	updateChatList()
	setChat(current_chat)
}


function loadChat(id) {
	chatview.innerHTML = ""
	for (const i of chats[id]) {
		if (i.role == "user") {
			chatview.innerHTML += '<li class="message msg_outgoing" id="message' + i + '">' + i.content + '</li>';
		}
		if (i.role == "assistant") {
			chatview.innerHTML += '<li class="message msg_incoming" id="message' + i + '">' + converter.makeHtml(i.content) + '</li>';
		}
	}
	msgid = chats[id].length
}

async function sendQuery() {
	var query = msg.value;
	console.log(query);
	chatview.innerHTML += '<li class="message msg_outgoing" id="message' + msgid + '">' + query + '</li>';
	msgid += 1;
	msg.value = "";
	msg.disabled = true;
	sendbutton.disabled = true;
	sendbutton.innerHTML = "Thinking..."
	chats[current_chat].push({role: 'user', content: query})
	const response = await ollama.chat({
		model: modelpicker.value,
		messages: chats[current_chat],
		stream: true,
	})
	chatview.innerHTML += '<li class="message msg_incoming" id="message' + msgid + '"></li>';
	const resp = document.getElementById("message" + msgid)
	chats[current_chat].push({role: 'assistant', content: ""})
	for await (const part of response) {
	  console.log(part)
	  chats[current_chat][chats[current_chat].length - 1].content += part.message.content
	  resp.innerHTML = converter.makeHtml(chats[current_chat][chats[current_chat].length - 1].content)
	}
	msgid += 1
	msg.disabled = false;
	sendbutton.disabled = false;
	sendbutton.innerHTML = "Send"
	localStorage.setItem("chats", JSON.stringify(chats))
	updateChatList()
}

async function updateModelList() {
	const list = await ollama.list()
	for (const model of list.models) {
		modelpicker.innerHTML += '<option value="' + model.model + '">' + model.name + '</option>'
	}
}

msg.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
    sendQuery();
  }
});
sendbutton.onclick = function() {sendQuery()}
newbutton.onclick = function() {newChat()}

updateModelList()

chats = JSON.parse(localStorage.getItem("chats"))
if(chats == null) {chats = [[]]}
console.log(chats)
current_chat = chats.length - 1
loadChat(current_chat)
updateChatList()
