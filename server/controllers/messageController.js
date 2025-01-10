const message = require('../models/messageSchema');
const Conversation = require('../models/conversationSchema')
// create message
exports.createMessage = async (req, res) => {
    try{

        const newMessage = await message.create(req.body);
        res.status(200).json({
            success: true,
            message: 'Message created successfully',
            data : newMessage
        })

        await Conversation.findByIdAndUpdate(req.body.conversationId, { updatedAt: Date.now() });

    }catch(error){
        res.status(500).json(error);
    }
}

// get all message
exports.getAllMessages = async (req, res) => {
    try{
        const id = req.params.conversationId;
        const messages = await message.find({ conversationId: id }).sort({createdAt: 1});
        res.status(200).json({
            success: true,
            message: 'All messages are fetched',
            data : messages
        })

    }catch(error){
        res.status(500).json(error);
    }
}

// get last message
exports.getLastMessage = async (req, res) => {
    try{
        const id = req.params.conversationId;
        const lastMessage = await message.find({ conversationId: id }).sort({createdAt: -1}).limit(1);
        res.status(200).json({
            success: true,
            message: 'Last message fetched',
            data : lastMessage
        })

    }catch(error){
        res.status(500).json(error);
    }
}

// delete message

exports.deleteMessage = async (req, res) =>{
    try{
        const id = req.params.messageId;
        const deletedMessage = await message.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Message deleted successfully',
            data: deletedMessage
        })
    }catch(error){
        res.status(500).json(error);
    }
}

