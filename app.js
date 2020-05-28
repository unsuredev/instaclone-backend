const express = require('express');
const app =  express()

const PORT = process.env.PORT || 5000 

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://jamal:KXbuZ7Uqmn6n2kWS@cluster0-wzgin.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false  })
mongoose.connection.on('connected', ()=>{
    console.log('connected to mongo')
}
)
mongoose.connection.on('error', (err)=>{
console.log('coecting error' , err)
}
)


require('./model/user');
require('./model/post')
app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))

app.listen(PORT, ()=>
{
    console.log(`server is running on port  ${PORT}`)
})