const connectToMongo=require('./db');
const express=require('express');
var cors=require('cors')

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
  }

connectToMongo();
const app=express()
const port=5000    

app.use(cors())
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port,()=>{
    console.log(`App listening at http://localhost:${port}`)
})
