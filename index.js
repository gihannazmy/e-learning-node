
const express = require('express')
require('./db')
const app = express()
const port = 3000


// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//
//global handler
app.use((err,req,res,next)=>{
    console.log('error', err);
    const statusCode = err.statusCode ||500;
    res.status(statusCode).json({msessage: 'something went wrong'});
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))