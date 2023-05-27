const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

const { create, getAll } = require('./controllers/message');
const { PORT, DB_HOST } = process.env;

const app = express();

app.use(cors());

const http = require('http').Server(app);

// const socket = require('socket.io')(http, { cors: { origin: 'https://socket-zilu.onrender.com' } });
const socket = require('socket.io')(http, { cors: { origin: 'http://localhost:3000' } });
// const socket = require('socket.io')(http, { cors: { origin: 'https://prime-chat.netlify.app/chat' } });

global.onlineUsers = new Map();

socket.on('connection', (user) =>
{
    user.emit('changeOnline', onlineUsers.size);
    user.on('addUser', async (data) =>
    {
        onlineUsers.set(user.id, data.name);
        user.emit('changeOnline', onlineUsers.size);
        user.broadcast.emit('changeOnline', onlineUsers.size);
        
        const res = await getAll();
        user.emit('messageList', res);
    });
    user.on('newMessage', async (message) =>
    {
        const data = await create(message);
        user.emit('alertMessage', data);
        user.broadcast.emit('alertMessage', data);
    });
    user.on('disconnect', () =>
    {
        onlineUsers.delete(user.id);
        user.broadcast.emit('changeOnline', onlineUsers.size);
    })
})

socket.on('getOnlineUsers', (user) => {
  const onlineUsersList = Array.from(onlineUsers.values());
  user.emit('onlineUsers', onlineUsersList);
});


mongoose.connect(DB_HOST);

http.listen(PORT, () => {console.log("Server is running")})

