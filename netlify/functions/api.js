import express, { Router } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import serverless from 'serverless-http'

const api = express()
const router = Router()

api.use(cors())
api.use(bodyParser.json())

mongoose.connect(process.env.DATABASE_URL)


//! SCHEMAS ----------------

const courseSchema = new mongoose.Schema({
    courseName: { type: String },
    location: { type: String },
    coursePar: { type: Number },
    bestScore: { type: Number }
})

const Course = mongoose.model('Course', courseSchema)

const scorecardSchema = new mongoose.Schema({
    playerName: { type: String },
    date: { type: String },
    weather: { type: String },
    courseName: { type: String },
    Hole1: { type: Number },
    courseHole1: { type: Number },
    Hole2: { type: Number },
    courseHole2: { type: Number },
    Hole3: { type: Number },
    courseHole3: { type: Number },
    Hole4: { type: Number },
    courseHole4: { type: Number },
    Hole5: { type: Number },
    courseHole5: { type: Number },
    Hole6: { type: Number },
    courseHole6: { type: Number },
    Hole7: { type: Number },
    courseHole7: { type: Number },
    Hole8: { type: Number },
    courseHole8: { type: Number },
    Hole9: { type: Number },
    courseHole9: { type: Number },
    Hole10: { type: Number },
    courseHole10: { type: Number },
    Hole11: { type: Number },
    courseHole11: { type: Number },
    Hole12: { type: Number },
    courseHole12: { type: Number },
    Hole13: { type: Number },
    courseHole13: { type: Number },
    Hole14: { type: Number },
    courseHole14: { type: Number },
    Hole15: { type: Number },
    courseHole15: { type: Number },
    Hole16: { type: Number },
    courseHole16: { type: Number },
    Hole17: { type: Number },
    courseHole17: { type: Number },
    Hole18: { type: Number },
    courseHole18: { type: Number }
})

const Scorecard = mongoose.model('Scorecard', scorecardSchema)


const userSchema = new mongoose.Schema({
    userEmail: { 
      type: String,
      required: true
    },
    lastLogin: { 
      type: Date,
      required: true
    }
  })
  
  const User = mongoose.model('User', userSchema)


//! COURSE CRUD --------------------------------

router.post('/course/new', async (req, res) => {
   const { courseName, location } = req.body

    try {
        if (!courseName || !location) {
            return res.status(400).json({ error: 'Name and location are required '})
        }
        
        const newCourse = new Course({
            courseName,
            location
        })

        const savedCourse = await newCourse.save()
        res.status(200).json(savedCourse)

    } catch (error) {
        console.error(error)
        res.status(500).send('Backend Server Error')
    }
})

router.get('/course', async (req, res) => {
    try {
        const allCourses = await Course.find({})
        return res.status(200).json(allCourses)
    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
})

router.get('/course/:id', async (req, res) => {
    try {
        const id = req.params.id
        const singleCourse = await Course.findById(id)

        if(!singleCourse){ 
            return res.status(404).json({
                message: 'Course not found'
            })
        }

        return res.status(200).json(singleCourse)
    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
})

router.put('/course/edit/:id', async (req, res) => {
    try {
        const id = req.params.id
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            {
                courseName: req.body.courseName,
                location: req.body.location,
            },
            { new: true }
        )

        if (!updatedCourse) {
            return res.status(404).json({
                message: 'Course not found'
            })
        }
        return res.status(200).json(updatedCourse)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Backend Server Error'
        })
    }
})

router.delete('/course/:id', async (req, res) => {
    try {
        const id = req.params.id
        await Course.findByIdAndDelete(id)
        console.log('Course deleted')
        res.sendStatus(204)
    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
})

//! SCORECARD CRUD ---------------------

router.post('/scorecard/new', async (req, res) => {
    const { playerName, courseName, date, weather } = req.body

    try {
        if (!playerName || !courseName || !date || !weather) {
            return res.status(400).json({error: 'Player name, course name, date, and weather are all required'})
        }

        const newScorecard = new Scorecard ({
            playerName,
            courseName,
            date,
            weather
        })
        const savedScorecard = await newScorecard.save()
        res.status(200).json(savedScorecard)

    } catch (error) {
        console.error(error)
        res.status(500).send('Backend Server Error')
    }
})

router.get('/scorecard', async (req, res) => {
    try {
        const allScorecards = await Scorecard.find({})
        return res.status(200).json(allScorecards)
    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
})

router.get('/scorecard/:id', async (req, res) => {
    try {
        const id = req.params.id
        const singleScorecard = await Scorecard.findById(id)
        return res.status(200).json(singleScorecard)

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
})

router.put('/scorecard/edit/:id', async (req, res) => {
    try {
        const id = req.params.id
        const existingScorecard = await Scorecard.findById(id)

        if (!existingScorecard) {
            return res.status(404).json({
                message: "Scorecard not found"
            })
        }

        existingScorecard.playerName = req.body.playerName
        existingScorecard.date = req.body.date
        existingScorecard.weather = req.body.weather
        existingScorecard.courseName = req.body.courseName

        for (let i = 1; i <= 18; i++) {
            const playerScoreKey = `Hole${i}`
            const courseScoreKey = `courseHole${i}`

            existingScorecard[playerScoreKey] = req.body[playerScoreKey]
            existingScorecard[courseScoreKey] = req.body[courseScoreKey]
        }

        const updatedScorecard = await existingScorecard.save()
        res.status(200).json(updatedScorecard)

    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.delete('/scorecard/:id', async (req, res) => {
    try {
        const id = req.params.id
        await Scorecard.findByIdAndDelete(id)
        res.sendStatus(204)
    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
})

//! USER ----------------------

router.post('/user/login', async (req, res) => {
    try {
        const now = new Date()
        const existingUserCount = await User.countDocuments({"userEmail": req.body.userEmail})
    
        if( existingUserCount === 0 ) {
            const newUser = new User ({
                userEmail: req.body.userEmail,
                lastLogin: now
            })

            await newUser.save()
            res.sendStatus(200)
      
        } else {
            await User.findOneAndUpdate({ "userEmail": req.body.userEmail }, { lastLogin: now });
            res.sendStatus(200)
          }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})
      
router.use('/api', router)

export const handler = serverless(api)