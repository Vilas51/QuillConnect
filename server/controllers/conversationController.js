const conversation = require('../models/conversationSchema');
const message = require('../models/messageSchema');

exports.createConversation = async (req, res) => {
    try{
        const newConversation = await conversation.create({ members : [...req.body.members] });

        res.status(200).json({
            success: true,
            message: 'Conversation created successfully',
            data : newConversation
        })

    }catch(error){
        res.status(500).json(error);
    }
}

exports.getSingleConversation = async (req, res) => {
    try {
        const { id1, id2 } = req.query;  // Use req.query for GET requests
        
        // Find the conversation where both id1 and id2 are members
        const conversations = await conversation.find({
            members: { $all: [id1, id2] }  // Use $all to ensure both ids are present
        });
        
        res.status(200).json({
            success: true,
            message: 'Single conversation fetched successfully',
            data: conversations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching conversation',
            error: error.message
        });
    }
};


exports.getConversation = async (req, res) => {
    try{

        const userId = req.params.userId;
        const conversations = await conversation.find({members : {$in : [userId]}}).sort({updatedAt : -1});
        res.status(200).json({
            success: true,
            message: 'All conversations are fetched',
            data : conversations
        })

    }catch(error){
        res.status(500).json(error);
    }
}

exports.addMember = async (req, res) => {
    try{
        const {conversationId} = req.params;
        const { userId } = req.body;
        const conversations = await conversation.findById(conversationId);
        const addMember = await conversations.updateOne({$push : {members : userId}});
        res.status(200).json({
            success: true,
            message: 'Member added successfully',
            data : addMember
        })

    }catch(error){
        res.status(500).json(error);
    }
}

exports.removeMember = async (req, res) => {
    try{
        const {conversationId} = req.params;
        const { userId } = req.body;
        const conversations = await conversation.findById(conversationId);
        const removeMember = await conversations.updateOne({$pull : {members : userId}});
        res.status(200).json({
            success: true,
            message: 'Member removed successfully',
            data : removeMember
        })

    }catch(error){
        res.status(500).json(error);
    }
}

exports.deleteConversation = async (req, res) => {
    try{
        const {id} = req.params;
        const messages = await message.deleteMany({conversationId : id});
        const conversations = await conversation.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Conversation deleted successfully',
            data : conversations, messages
        })

    }catch(error){
        res.status(500).json(error);
    }
}