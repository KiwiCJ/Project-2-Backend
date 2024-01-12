//! SERVER
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'

const app = express()

app.use(cors())
app.use(bodyParser.json)

mongoose.connect(process.env.DATABASE_URL)

const port = 3000

app.listen(port, () => {
    console.log(`App listening on port: ${port}`)
})

//! SCHEMAS ----------------

const farmSchema = new mongoose.Schema({
    name: {type: string},
    location: {type: string}
    
})
