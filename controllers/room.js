// Controller handler to handle functionality in room page

const roomGenerator = require('../util/roomIdGenerator.js');
const Chat = require('../models/Chat.js')
// Example for handle a get request at '/:roomName' endpoint.
function getRoom(request, response){
    Chat.find( {roomName: request.params.roomName} ).lean().then(items =>
        {
            console.log(request.params.roomName);
            response.render('room', {title: 'chatroom', chat: items, roomName: request.params.roomName, newRoomId: roomGenerator.roomIdGenerator()});
        }
    )}

module.exports = {
    getRoom
};