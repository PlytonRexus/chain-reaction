const connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity",
    "timeout" : 10000,
    "transports": ["websocket"]
};

const socket = io(connectionOptions);

const names = [
    "guffaw", "hitherto", "ligature", "guidon", 
    "hoary", "limner", "guilloche", "hobbledehoy", 
    "titmouse", "holystone", "hobgoblin", "tittup", 
    "homeric", "intagliated", "tmesis", "tormentil"
];

let state = {};

function lread(key) {
    return atob(sessionStorage.getItem(key));
}

function lwrite(key, value) {
    return sessionStorage.setItem(key, btoa(value));
}

function printableTime(time) {
    let date = new Date(time);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

if (!lread('chrct-currentRoom') || !lread('chrct-username'))
    window.open("/");

state.currentRoom = (lread('chrct-currentRoom')) || 'default';
state.username = (lread('chrct-username')) ||  
    names[Math.floor(Math.random() * names.length)];

/**
 * Client emitted events:
 * 1. connection (default)
 * 2. disconnect (default)
 * 3. join (upon page load)
 * 4. turn_played 
 * 5. game_loop (upon starting of a `gameLoop`)
 */

socket.emit('join', {
    currentRoom:  state.currentRoom,
    username: state.username
});

/**
 * Socket listeners.
 */

/* Regular utilities */
socket.on('disconnect', () => {
    let time = Date.now(),
        username = "CR2.0";
    addToChatbox("Socket connection status:" + socket.connected, time, username); // false
});

socket.on('welcome', (message, { playerNumber, mode }) => {
    let time = Date.now(),
        username = "CR2.0";
    addToChatbox(message, printableTime(time), username);

    loadFromState(gameState, gameState.status);

    // lwrite("chrct-mode", mode);
    // lwrite("chrct-players", playerNumber);
    // init();
});

socket.on('notify_join', (message) => {
    let time = Date.now(),
        username = "CR2.0";
    addToChatbox(message, printableTime(time), username);
    socket.emit('send_state', { gameState });
    console.log(message);
});

socket.on('notify_left', (message) => {
    let time = Date.now(),
        username = "CR2.0";
    addToChatbox(message, printableTime(time), username);
    console.log(message);
});

/* Game related */
socket.on('notify_loop', ({ gameState, time, username, status }) => {
    let date = new Date(time)
    addToChatbox(
        `${username === state.username ? "You" : username} played.`, 
        printableTime(date), 
        username
    );
    loadFromState(gameState, status);
});

socket.on('notify_undo', function({ e, time }) {
    console.log(time);
});

socket.on('notify_reset', function({ username, time }) {
    addToChatbox(`I have reset the game at ${time}.`, printableTime(time), username);
    resetGame(true);
});

socket.on('notify_sync_request', function() {
    socket.emit("send_sync_state", { gameState });
});

socket.on('notify_sync', function({ gameState }) {
    loadFromState(gameState, gameState.status);
});

/* Chat related */
socket.on("notify_message", function({ message, username, time, player }) {
    addToChatbox(message, printableTime(time), username);
    if (document.querySelector('#receipt-' + number))
        document.querySelector('#receipt-' + number).scrollIntoView();
});