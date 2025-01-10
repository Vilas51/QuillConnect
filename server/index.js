const express = require('express');
const app = express(); 
const cors = require('cors'); 
app.use(cors());


require('dotenv').config();
const PORT = process.env.PORT || 4000;
 
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 

app.listen(PORT,()=>{
    console.log(`server started at port no ${PORT}`);
})

//connecting database
const {dbConnect} = require('./config/database')
dbConnect();
 
app.get('/', (req, res) => {
    res.send('Server is running!');
}); 


const auth = require('./Routes/auth');
const comment = require('./Routes/comment')
const user = require('./Routes/user');
const posts = require('./Routes/posts');
const conversation = require('./Routes/conversation');
const message = require('./Routes/message');
  
app.use('/api/user',user); 
app.use('/api/comment',comment);   
app.use('/api/auth', auth);
app.use('/api/posts', posts); 
app.use('/api/conversation', conversation);
app.use('/api/message', message);      