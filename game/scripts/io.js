const connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "10000",
    "timeout" : 10000,
    "transports" : ["websocket"]
};

const socket = io(connectionOptions);

const names = [
    "guffaw", "hitherto", "ligature", "guidon", 
    "hoary", "limner", "guilloche", "hobbledehoy", 
    "titmouse", "holystone", "hobgoblin", "tittup", 
    "homeric", "intagliated", "tmesis", "tormentil"
];

const lread = localStorage.getItem.bind(localStorage);

let state = {};

state.currentRoom = atob(lread('chrct-currentRoom')) || 'default';
state.username = atob(lread('chrct-username')) ||  
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

socket.on('disconnect', () => {
    console.log("Socket connection status:", socket.connected); // false
});

socket.on('welcome', (message) => {
    console.log(message);
});

socket.on('notify_join', (message) => {
    console.log(message);
});

socket.on('notify_left', (message) => {
    console.log(message);
});

socket.on('notify_loop', ({ e, time, username, canvas }) => {
    let date = new Date(time);
    console.log(
    `${username} played at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.`
    );

    let newEvent = new MouseEvent('click', e);

    gameLoop(newEvent);
});

socket.on('notify_undo', function({ e, time }) {
    undoGame(e);
    console.log(time);
});