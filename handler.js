const { server } = require('./server');

const io = require('socket.io')(server);

/**
 * I don't intend to support ability to only be able
 * to play one's own turn from a single device.
 * Any turn of any player can be played from any device.
 * 
 * Would help in sharing devices in cases players 
 * are more than 2.
 * 
 * Server emitted events:
 * 1. welcome (upon receiving `join` event)
 * 2. next_turn (upon receiving `turn_played` event)
 * 3. redraw_matrix (for miscellaneous occurences)
 * 4. notify_left (upon receiving `disconnect event`)
 * 5. notify_join (upon receiving `join`)
 * 6. notify_loop(upon receiving `game_loop`)
 * 
 * Client emitted events:
 * 1. connection
 * 2. disconnect
 * 3. join
 * 4. turn_played
 * 5. game_loop
 */

let now = [];

function usrObject(id, currentRoom, username) {
    return {
        id, currentRoom, username
    }
}

function cacheValues(id, currentRoom, username) {
    let idx = now.findIndex(val => val.id === id);

    if (idx) {
        now[idx] = usrObject(...arguments);
    } else {
        now.push(usrObject(...arguments));
    }
}

function getCachedValues(obj) {
    let keys = Object.keys(obj);
    return now.filter(function(val) {
        let i = 0;
        while (i < keys.length) {
            if (obj[key] == val[key]) i += 1;
            return false;
        }
        return true;
    });
}

function handleConnect(socket) {
    // listen for join event
    socket.on('join', function({ currentRoom, username }) {

        ////////////////////////////
        //       Join Room        //
        ////////////////////////////
        // join the specified room
        socket.join(currentRoom);

        // cache user values
        cacheValues(socket.id, currentRoom, username);

        ////////////////////////////
        //    Notify New Member   //
        ////////////////////////////
        // tell others someone has joined.
        socket
        .to(currentRoom)
        .emit(
            `notify_join`, 
            `${username} just joined the room.`
        );
        
        ////////////////////////////
        //   Welcome New Member   //
        ////////////////////////////
        // welcome the new entrant
        socket.emit('welcome', `Welcome to ${currentRoom}, ${username}.`);

        ////////////////////////////
        //       Game Loop        //
        ////////////////////////////
        // listen for game loop
        socket.on('game_loop', async function({ e, time, canvas }) {
            // send event data to others

            socket
            .to(currentRoom)
            .emit('notify_loop', { 
                e, 
                time, 
                username
            });
        });
        
        ////////////////////////////
        //       Disconnect       //
        ////////////////////////////
        // listen for `disconnect`
        socket.on('disconnect', function() {
            // tell others someone left
            socket
            .to(currentRoom)
            .emit(
                `notify_left`,
                `${username} just left the room.`
            )
        });
    });
}

exports.io = io.on('connection', handleConnect);