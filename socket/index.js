const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
    },
});

let users = new Map();

io.on('connection', (socket) => {
    console.log("A new user connected:", socket.id);

    socket.on("addUser", (userId) => {
        users.set(userId, socket.id);
        console.log(`User added: ${userId}, Socket ID: ${socket.id}`);
        io.emit("getUsers", Array.from(users.keys()));
    });

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const receiverSocketId = users.get(receiverId);
        if (receiverSocketId) {
            console.log(`Sending message from ${senderId} to ${receiverId}: ${text}`);
            io.to(receiverSocketId).emit("getMessage", {
                senderId,
                text,
            });
        } else {
            console.log(`User ${receiverId} is not online.`);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        for (let [userId, socketId] of users.entries()) {
            if (socketId === socket.id) {
                users.delete(userId);
                break;
            }
        }
        io.emit("getUsers", Array.from(users.keys()));
    });
});