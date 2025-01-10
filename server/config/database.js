const mongoose = require('mongoose');
require("dotenv").config();

exports.dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Database connected successfully");
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}
