const express= require('express')
const cors =require('cors')
const cookieParser = require('cookie-parser');
const path = require('path'); // Add this line
const app = express()
const authRoute=require('./routes/authRoute')
const userRoute=require('./routes/userRoute')
const tokenRoute=require('./routes/token')
const groupRoute=require('./routes/groupRoute')
const {startGroupSocketServer}=require('./sockets/groupSocket')
const {StartUserSocketServer}=require('./sockets/userSocket')
const bodyParser = require('body-parser');


  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.json())
app.use('/uploads', express.static('uploads'));

app.use('/',authRoute)

app.use('/token',tokenRoute)

app.use('/group',groupRoute)

app.use('/user',userRoute)
 


startGroupSocketServer()
StartUserSocketServer()
app.listen(3001,()=>{
    console.log('app in running')
})