import express from "express"
import jwt from "jsonwebtoken"

import User from "../models/users"

import { DecodedToken } from '../types/decodedToken'
import SECRET from "../constants/jwtSecret"


const router = express.Router()

// Return the number of chances left for a user
router.get("/chances-left/:email", async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.params.email,
      })
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" })
      }
  
      console.log(user)
      let chancesLeft: number = user.chancesLeft
      console.log("chances left : " + chancesLeft)
      res.json(chancesLeft.toString())
    } catch (err) {
        console.error("Erreur :", err)
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des chances restantes" })
    }
})


router.post("/rolling-dices", async(req, res) => {
    let dices: number[] = []
  
    const token: string = req.headers['x-access-token'] as string;
  
    try {
      const decoded = jwt.verify(token, SECRET) as DecodedToken;
      const email: string = decoded.email
  
      const user = await User.findOne({ email: email })
  
      if (user) {
        let won = 0
        if (user.chancesLeft <= 0) {
          dices = [0, 0, 0, 0, 0]
          return res.json({ status: 'error', error: 'No more changes. The dices have been rolled 3 times', chancesLeft: user.chancesLeft, dices: dices, numberOfPastriesWon: won })
        }

        // Give more chance to win for the user if it is his last attempt
        if (user.chancesLeft == 1) {
          dices = Array.from({length: 5}, () => getRandomNumberKind());
        } else {
          dices = Array.from({length: 5}, () => getRandomNumber());
        }
        dices = [1,1,1,1,1]
        
        if (numberOfPastriesWon(dices) != 0) {
          won = numberOfPastriesWon(dices)
          user.chancesLeft = 0
        } else {
          user.chancesLeft--
        }
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




function getRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
}

function getRandomNumberKind() {
  return Math.floor(Math.random() * 5) + 1;
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

function isThereTwoPairs(dices: Array<number>) {
    const occurrences: { [key: number]: number } = {}
    for (const dice of dices) {
        occurrences[dice] = (occurrences[dice] || 0) + 1;
    }
  
    // Compter le nombre de paires
    let pairCount = 0;
    for (const value of Object.values(occurrences)) {
        if (value === 2 || value === 3) {
            pairCount++;
        }
    }
  
    return pairCount === 2;
}
  
function isThereFourIndenticalNumbers(dices: Array<number>) {
    const identicalCount: number = dices.filter(dice => dice === dices[0]).length;
    return identicalCount === 4
}
  
function isThereFiveIndenticalNumbers(dices: Array<number>) {
    const allEqual: boolean = dices.every((dice, index) => dice === dices[0]);
    return allEqual
}


export default router;