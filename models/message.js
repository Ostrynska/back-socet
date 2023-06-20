const { Schema, model } = require('mongoose');

const messageSchema = Schema({
    text: {
        type: String,
    },
    name: {
        type: String,
    },
    date: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = model('message', messageSchema);

module.exports = Message;