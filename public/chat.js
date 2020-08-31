let number = 0;

const addReceipt = (username, date) => {
	let list = $("#chat-list");

    var li = document.createElement('li');
    var span = document.createElement('span');
    var b = document.createElement('b');
    number = list.children.length + 1;
    li.setAttribute('id', 'receipt-' + number);
    span.setAttribute('id', 'receipt-text-' + number);
    li.setAttribute('class', 'receipt-cont');
    span.setAttribute('class', 'receipt');
    b.appendChild(document.createTextNode(username.toUpperCase()));
    span.appendChild(b);
    span.appendChild(document.createTextNode(` ${date}`));
    li.appendChild(span);
    list.appendChild(li);
}

function addToChatbox(message, date, username) {
	let list = $("#chat-list");

	var li = document.createElement('li');
    var span = document.createElement('span');
    number = list.children.length + 1;
    li.setAttribute('id', 'not-my-msg-' + number);
    li.setAttribute('class', 'not-my-msg-cont');
    span.setAttribute('class', 'not-my-msg');
    span.appendChild(document.createTextNode(message));
    li.appendChild(span);
    list.appendChild(li);
    addReceipt(username, date);
}

$("#chat-input").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const msg = e.target.value;
    if (msg == '') {
      return;
    }

    const timestamp = new Date().getTime();

    const msgObject = {
        username: state.username,
        message: msg,
        time: Date.now(),
        currentRoom: state.currentRoom
    };

    socket.emit('send_message', msgObject);

    e.target.value = '';
    e.target.focus();
});