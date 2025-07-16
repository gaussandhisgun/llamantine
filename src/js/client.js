import { Ollama } from 'https://esm.run/ollama/browser'

const converter = new showdown.Converter()
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })
const sendbutton = document.getElementById("send")
const msg = document.getElementById("message")
const modelpicker = document.getElementById("modelpicker")

var id = 0
var chat = []

async function sendQuery() {
	var query = msg.value;
	console.log(query);
	document.getElementById("messages").innerHTML += '<li class="message msg_outgoing" id="message' + id + '">' + query + '</li>';
	id += 1;
	msg.value = "";
	chat.push({role: 'user', content: query})
	const response = await ollama.chat({
		model: modelpicker.value,
		messages: chat,
		stream: true,
	})
	document.getElementById("messages").innerHTML += '<li class="message msg_incoming" id="message' + id + '"></li>';
	const resp = document.getElementById("message" + id)
	chat.push({role: 'assistant', content: ""})
	for await (const part of response) {
	  console.log(part)
	  chat[chat.length - 1].content += part.message.content
	  resp.innerHTML = converter.makeHtml(chat[chat.length - 1].content)
	}
	id += 1
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

updateModelList()

