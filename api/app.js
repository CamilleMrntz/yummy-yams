import express from "express"
import mongoose from "mongoose"
import Pastry from "./models/pastries.mjs"
import cors from "cors"
import User from "./models/users.mjs"
import jwt from "jsonwebtoken"

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())


mongoose.connect('mongodb://localhost:27017/yams_db', {  // mongo:27017 pour lancer avec docker  // localhost:27017 pour lancer en local
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connexion à MongoDB réussie')
})
.catch((error) => {
  console.error('Erreur de connexion à MongoDB :', error)
})


// REGISTRATION
app.post('/registration', async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      chancesLeft: 3,
    })
    res.json({ status: 'ok'})
  } catch (error) {
    console.log(error)
    res.json({ status: 'error', error: error })
  }
})

// LOGIN
app.post('/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  })
  if (user) {
    const token = jwt.sign({
      name: user.name,
      email: user.email,
    }, 'secret123') // TODO : replace secret123 by an environment variable .env

    console.log(token)
    return res.json({ status: 'ok', user: token })
  } else {
    return res.json({ status: 'error', user: false })
  }
  
  
})



// Return the json
app.get("/pastries", async (req, res) => {
    try {
        const pastries = await Pastry.find()
        res.json(pastries)
    } catch (err) {
        console.error("Erreur :", err)
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" })
    }
})

// Return the count of pastries left
app.get("/pastries-left", async (req, res) => {
    try {
        const pastries = await Pastry.find()
        var pastriesLeft = 0
        pastries.forEach(pastry => {
            pastriesLeft += pastry.stock
        });
        console.log(pastriesLeft)
        res.json(pastriesLeft.toString())
    } catch (err) {
        console.error("Erreur :", err)
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" })
    }
})

// Return the list of images
app.get("/pastries-img", async(req, res) => {
  try {
    const pastries = await Pastry.find()
    let pastriesImg = []
    pastries.forEach(pastry => {
      pastriesImg.push(pastry.image)
    });
    res.json(pastriesImg)
  } catch (err) {
        console.error("Erreur :", err)
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" })
    }
})





// Dice Game
function getRandomNumber() {
  return Math.floor(Math.random() * 6) + 1;
}


app.post("/rolling-dices", async(req, res) => {
  let numbers = [
    getRandomNumber(),
    getRandomNumber(),
    getRandomNumber(),
    getRandomNumber(),
    getRandomNumber()
  ]
  console.log(numbers)

  const token = req.headers['x-access-token']

  try {
    const decoded = jwt.verify(token, 'secret123')
    const email = decoded.email

    const user = await User.findOne({ email: email })

    if (user) {
      if (user.chancesLeft <= 0) {
        return res.json({ status: 'error', error: 'No more changes. The dices have been rolled 3 times' })
      }
      user.chancesLeft--
      await user.save()
      return res.json(numbers)

    } else {
      throw new Error('User not found')
    }

  } catch (error) {
		console.log(error)
		return res.status(500).json({ status: 'error', error: 'Invalid token or user not found' })
	}
})


app.listen(port, () => console.log(`App démarrée sur http://localhost:${port}`));
