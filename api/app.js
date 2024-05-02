import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import jwt from "jsonwebtoken"
import Pastry from "./models/pastries.mjs"
import User from "./models/users.mjs"
import Winner from "./models/winners.mjs"

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
        let pastriesLeft = 0
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

function isThereTwoPairs(dices) {
  const occurrences = {};
  for (const dice of dices) {
      occurrences[dice] = (occurrences[dice] || 0) + 1;
  }

  // Compter le nombre de paires
  let pairCount = 0;
  for (const value of Object.values(occurrences)) {
      if (value === 2) {
          pairCount++;
      }
  }

  return pairCount === 2;
}

function isThereFourIndenticalNumbers(dices) {
  const identicalCount = dices.filter(dice => dice === dices[0]).length;
  return identicalCount === 4
}

function isThereFiveIndenticalNumbers(dices) {
  const allEqual = dices.every((dice, index) => dice === dices[0]);
  return allEqual
}

function numberOfPastriesWon(dices) {
  if (isThereFiveIndenticalNumbers(dices)) {
    return 3
  } else if (isThereFourIndenticalNumbers(dices)) {
    return 2
  } else if (isThereTwoPairs(dices)) {
    return 1
  } else {
    return 0
  }
}

app.get("/chances-left/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    })

    console.log(user)
    let chancesLeft = user.chancesLeft
    console.log("chances left : " + chancesLeft)
    res.json(chancesLeft.toString())
  } catch (err) {
      console.error("Erreur :", err)
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des chances restantes" })
  }
})


app.post("/rolling-dices", async(req, res) => {
  // let dices = [
  //   getRandomNumber(),
  //   getRandomNumber(),
  //   getRandomNumber(),
  //   getRandomNumber(),
  //   getRandomNumber()
  // ]
  let dices = [
    4,
    4,
    4,
    4,
    getRandomNumber()
  ]
  console.log(dices)

  const token = req.headers['x-access-token']

  try {
    const decoded = jwt.verify(token, 'secret123')
    const email = decoded.email

    const user = await User.findOne({ email: email })

    if (user) {
      let won = 0
      if (user.chancesLeft <= 0) {
        dices = [0, 0, 0, 0, 0]
        return res.json({ status: 'error', error: 'No more changes. The dices have been rolled 3 times', chancesLeft: user.chancesLeft, dices: dices, numberOfPastriesWon: won })
      }
      
      if (numberOfPastriesWon(dices) != 0) {
        won = numberOfPastriesWon(dices)
        console.log("pastries won " + won)
      }
      user.chancesLeft--
      await user.save()
      return res.json({ dices: dices, chancesLeft: user.chancesLeft, numberOfPastriesWon: won })

    } else {
      throw new Error('User not found')
    }

  } catch (error) {
		console.log(error)
		return res.status(500).json({ status: 'error', error: 'Invalid token or user not found' })
	}
})

// endpoint to get the pastries left to win
app.get("/pastries-left-to-win", async(req, res) => {
  try {
    let pastriesLeft = await Pastry.find({
      stock: { $gt: 0 },
    })
    res.json(pastriesLeft)
  } catch (err) {
      console.error("Erreur :", err)
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" })
  }
})

// endpoint to post the pastries choosed (name of the pastry, date and hour of winning, number of pastries won)
app.post("/choose-pastries", async(req, res) => {
  const token = req.headers['x-access-token']

  try {
    const decoded = jwt.verify(token, 'secret123')
    const email = decoded.email
    const user = await User.findOne({ email: email })

    if (user) {
      const winner = await Winner.create({
        userName: user.name,
        date: req.body.winningDate,
        numberOfPastriesWon: req.body.numberOfPastriesWon,
        pastries: req.body.pastriesChoosed,
      })

      // update stock & quantityWon
      let pastriesChoosed = req.body.pastriesChoosed
      console.log(pastriesChoosed)
      await Promise.all(pastriesChoosed.map(async (pastry) => {
        // Find and update the pastry
        await Pastry.findOneAndUpdate(
          { name: pastry.name, stock: { $gt: 0 } },
          { $inc: { quantityWon: 1, stock: -1 }},
        )
      }))
    }
    console.log(req.body)
    res.json({ status: 'ok'})

  } catch (err) {
      console.error("Erreur :", err)
		  return res.status(500).json({ status: 'error', error: 'Invalid token or user not found' })
  }
})

app.listen(port, () => console.log(`App démarrée sur http://localhost:${port}`));
