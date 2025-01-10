const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const user = require('../models/userSchema');

exports.getAllUsers = async(req, res) => {
    try{
        const users = await user.find();
        res.status(200).json({
            success : true,
            message : "All users fetched successfully",
            data : users
        })
    }catch(err){
        res.status(500).json(err);
    }                               
}

exports.createUser = async (req, res) => {
    try{
        const {name, username, email, password} = req.body; 
        //check wheather the user already exists or not
        const User = await user.findOne({email: email});
        if(User){
            return res.status(400).json(
                {
                    success: false,
                    message: 'User already exists',
                    data : User   
                } 
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = await user.create({name,email,username, password:hashPassword});
        res.status(200).json(
            {
                success: true,
                message: 'User created successfully',
                data : newUser   
            } 
        )
    }catch(err){
        res.status(500).json(err);
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const User = await user.findOne({ email: email });
        console.log(User)

        // User not found
        if (!User) {
            return res.status(404).json("User not found");
        }

        const validPassword = await bcrypt.compare(password, User.password);

        // Invalid password
        if (!validPassword) {
            return res.status(400).json("Invalid Password");
        }

        // Successful login
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: User._id
        });
    } catch (err) {
        // Error handling
        return res.status(500).json(err);
    }
};

exports.updateUser = async(req, res) => {
    try{
        const {id} = req.params;

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashPassword;
        }

        const updatedUser = await user.findByIdAndUpdate(id, {$set: req.body}, {new:true});
        res.status(200).json({
            success : true,
            message : "User updated successfully",
            data : updatedUser
        })  
    }catch(err){
        res.status(500).json(err);
    }
}
 
exports.getUser = async(req, res)=>{
    try{
        const {id} = req.params;
        const currUser = await user.findById(id);
        const {password, ...others} = currUser._doc;
        res.status(200).json({
            success : true,
            message : "single user fetched",
            data : others
        })
    }catch(err){
        res.status(500).json(err);
    }
}

exports.deleteUser = async(req, res)=>{
    try{
        const {id} = req.params;
        const user = await user.findByIdAndDelete(id);
        res.status(200).json({
            success : true,
            msg : "User Deleted Successfully",
            data : user
        })
    }catch(err){
        res.status(500).json(err);
    }
}

exports.followUser = async(req, res) => {
    try{
        const nextUser = await user.findById(req.params.id) ;
        const self = await user.findById(req.body.userId);

        // check if it's the nextUSer is you itself
        if(req.body.userId != req.params.id){

            // check if you already following or not
            if(!self.followings.includes(req.params.id)){

                //add the user to the followings list of the self
                await self.updateOne({ $push : { followings : req.params.id }})

                //add the self to the followers list of the user
                await nextUser.updateOne({ $push : { followers : req.body.userId }})
                res.status(200).json({
                    success : true,
                    message : "followed successfully",
                    data1 : updatedSelf,
                    data2 : updatedUser
                }) 
            }else{
                res.status(404).json("You already follow the user")
            }

        }else{
            res.status(404).json("You can't follow yourself");
        }
        
    }catch(err){
        res.status(200).json(err);
    }
}

exports.unfollowUser = async(req, res) => {
    try{
        const nextUser = await user.findById(req.params.id) ;
        const self = await user.findById(req.body.userId);

        // check if it's the nextUSer is you itself or not
        if(req.body.userId != req.params.id){

            // check if you already following or not
            if(self.followings.includes(req.params.id)){

                //remove the user to the followings list of the self
                await self.updateOne({ $pull : { followings : req.params.id }})

                //remove the self to the followers list of the user
                await nextUser.updateOne({ $pull : { followers : req.body.userId }})

                console.log('self: ',self)
                console.log("nextUser:", nextUser)


            }else{
                res.status(404).json("You already not follow the user")
            }

        }else{
            res.status(404).json("You can't unfollow yourself");
        }

        res.status(200).json({
            success : true,
            message : "unfollowed successfully",
            data1 : updatedSelf,
            data2 : updatedUser
        }) 
    }catch(err){
        res.status(200).json(err);
    }
}