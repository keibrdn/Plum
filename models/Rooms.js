const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const generator = require('/util/roomIdGenerator');

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});
module.exports = Item = mongoose.model('room', RoomSchema);