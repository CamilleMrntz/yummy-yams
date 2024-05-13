import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import jwt from "jsonwebtoken"
import argon2 from "argon2"
import dotenv from "dotenv"

import Pastry from "./models/pastries"
import User from "./models/users"
import Winner from "./models/winners"

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

dotenv.config();
const SECRET: string = process.env.JWT_SECRET || '';


mongoose.connect('mongodb://localhost:27017/yams_db', {})  // mongo:27017 pour lancer avec docker  // localhost:27017 pour lancer en local
.then(() => {
  console.log('Connexion à MongoDB réussie')
})
.catch((error) => {
  console.error('Erreur de connexion à MongoDB :', error)
})


async function encryptPassword(password: string) {
  try {
      const hashedPassword: string = await argon2.hash(password);
      return hashedPassword;
  } catch (err) {
      console.error('Erreur lors du hachage du mot de passe:', err);
      throw err;
  }
}


// REGISTRATION
app.post('/registration', async (req, res) => {
  console.log(req.body)

  try {
    const hashedPassword: string = await encryptPassword(req.body.password);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
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
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user)

    if (!user) {
      return res.json({ status: 'error', user: false, message: 'user does not exist' });
    }

    const passwordMatch: boolean = await argon2.verify(user.password, req.body.password);
    console.log(passwordMatch)

    console.log("secret " + SECRET)

    if (passwordMatch) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        SECRET
      );

      console.log(token);
      return res.json({ status: 'ok', user: token, username: user.name });
    } else {
      return res.json({ status: 'error', user: false, message: 'passwords are not matching' });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.json({ status: 'error', error: error });
  }
});



// PASTRIES
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
        let pastriesLeft: number = 0
        pastries.forEach(pastry => {
          if (pastry.stock !== undefined && pastry.stock !== null) {
            pastriesLeft += pastry.stock;
          }
        });
        console.log("pastries left : " + pastriesLeft)
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
    let pastriesImg: string[] = []
    pastries.forEach(pastry => {
      if (pastry.image) {
        pastriesImg.push(pastry.image)
      }
    });
    res.json(pastriesImg)
  } catch (err) {
        console.error("Erreur :", err)
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" })
    }
})




// DICE GAME
function getRandomNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

function isThereTwoPairs(dices: Array<number>) {
  const occurrences: { [key: number]: number } = {}
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

function isThereFourIndenticalNumbers(dices: Array<number>) {
  const identicalCount = dices.filter(dice => dice === dices[0]).length;
  return identicalCount === 4
}

function isThereFiveIndenticalNumbers(dices: Array<number>) {
  const allEqual = dices.every((dice, index) => dice === dices[0]);
  return allEqual
}

function numberOfPastriesWon(dices: Array<number>) {
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

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

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
    const decoded = jwt.verify(token, SECRET)
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

// return the array of the pastries left to win
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
    const decoded = jwt.verify(token, SECRET)
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
      await Promise.all(pastriesChoosed.map(async (pastry: typeof Pastry) => {
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


// WINNERS
app.get("/winners", async (req, res) => {
  try {
    const winners = await Winner.find()
    res.json(winners)
  } catch (err) {
      console.error("Erreur :", err)
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des winners" })
  }
})

app.listen(port, () => console.log(`App démarrée sur http://localhost:${port}`));
