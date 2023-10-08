const express = require('express')
const app = express()
const dotenv = require('dotenv')
const port = 3010
const connectDB = require('./db/connectDB')
const bodyParser=require("body-parser")
const session = require('express-session')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const path = require('path');


//bodyparse
app.use(bodyParser.urlencoded({extended:false}))

//session message
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
    
}));

//flash message
app.use(flash());

//file upload
// app.use(fileUpload({useTempFiles: true}));

//cookies
app.use(cookieParser())

//require web file
const web = require('./routes/web.js')

//load routing
app.use('/',web)

//for API, use like bodyParser
app.use(express.json())

//env file setup
dotenv.config({
    path: '.env'
})

//setup of templating engine
app.set('view engine','ejs')



//link public folder
// app.use(express.static('public'))
// app.use(express.static('uploads'))
app.use(express.static(path.join(__dirname, 'uploads')));




//db connection
connectDB()


app.listen(port,()=>{
    console.log(`Server is running at localhost:${port}`)
})