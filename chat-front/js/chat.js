let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;

const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);
eventSource.onmessage = (event) => {
	const data = JSON.parse(event.data);
	if (data.sender === username) {
		initMyMessage(data);
	} else {
		initYourMessage(data);
	}
}

function getSendMsgBox(data) {

	let md = data.createdAt.substring(5, 10)
	let tm = data.createdAt.substring(11, 16)
	convertTime = tm + " | " + md

	return `<div class="sent_msg">
	<p>${data.msg}</p>
	<span class="time_date"> ${convertTime} / <b>${data.sender}</b> </span>
</div>`;
}

function getReceiveMsgBox(data) {

	let md = data.createdAt.substring(5, 10)
	let tm = data.createdAt.substring(11, 16)
	convertTime = tm + " | " + md

	return `<div class="received_withd_msg">
	<p>${data.msg}</p>
	<span class="time_date"> ${convertTime} / <b>${data.sender}</b> </span>
</div>`;
}

function initMyMessage(data) {
	let chatBox = document.querySelector("#chat-box");

	let sendBox = document.createElement("div");
	sendBox.className = "outgoing_msg";

	sendBox.innerHTML = getSendMsgBox(data);
	chatBox.append(sendBox);

	document.documentElement.scrollTop = document.body.scrollHeight;
}

function initYourMessage(data) {
	let chatBox = document.querySelector("#chat-box");

	let receivedBox = document.createElement("div");
	receivedBox.className = "received_msg";

	receivedBox.innerHTML = getReceiveMsgBox(data);
	chatBox.append(receivedBox);

	document.documentElement.scrollTop = document.body.scrollHeight;
}

async function addMessage() {
	let msgInput = document.querySelector("#chat-outgoing-msg");

	let chat = {
		sender: username,
		roomNum: roomNum,
		msg: msgInput.value
	};

	fetch("http://localhost:8080/chat", {
		method: "post",
		body: JSON.stringify(chat),
		headers: {
			"Content-Type": "application/json; charset=utf-8"
		}
	});

	msgInput.value = "";
}

document.querySelector("#chat-outgoing-button").addEventListener("click", () => {
	addMessage();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
	if (e.keyCode === 13) {
		addMessage();
	}
});