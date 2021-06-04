const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  text: {
    type: String,
    required: true
  },
  roomName: {
    type: String,
    required: true
  },
  ID: {
    type: String,
    required: true
  }

});
module.exports = Item = mongoose.model('chat', ChatSchema);