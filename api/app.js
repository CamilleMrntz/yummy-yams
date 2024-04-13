import express from "express"
import mongoose from "mongoose"
import Pastry from "./models/pastries.mjs"
import cors from "cors"
import User from "./models/users.mjs"

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
    })
    res.json({ status: 'ok'})
  } catch (error) {
    res.json({ status: 'error', error: 'Duplicated email' })
  }
})

// LOGIN
app.post('/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  })
  if (user) {
    res.json({ status: 'ok', user: true })
  } else {
    res.json({ status: 'error', user: false })
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



app.listen(port, () => console.log(`App démarrée sur http://localhost:${port}`));
