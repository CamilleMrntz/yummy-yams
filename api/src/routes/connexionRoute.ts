import express from "express"
import argon2 from "argon2"
import jwt from "jsonwebtoken"

import User from "../models/users"
import SECRET from "../constants/jwtSecret"
import Winner from "../models/winners"

const router = express.Router()

// REGISTRATION
router.post('/registration', async (req, res) => {
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
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({ status: 'error', user: false, message: 'user does not exist' });
    }

    const passwordMatch: boolean = await argon2.verify(user.password, req.body.password);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        SECRET,
        { expiresIn: '1 hours' },
      );
    
      const winner = await Winner.findOne({ email: user.email })

      if (winner) {
        const numberOfPastriesWon: number = winner.numberOfPastriesWon
        return res.json({ status: 'ok', user: token, username: user.name, chancesLeft: user.chancesLeft, winner: true, numberOfPastriesWon: numberOfPastriesWon });
      } else {
        return res.json({ status: 'ok', user: token, username: user.name, chancesLeft: user.chancesLeft, winner: false, numberOfPastriesWon: 0 });
      }

    } else {
      return res.json({ status: 'error', user: false, message: 'passwords are not matching' });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.json({ status: 'error', error: error });
  }
});


async function encryptPassword(password: string) {
    try {
        const hashedPassword: string = await argon2.hash(password);
        return hashedPassword;
    } catch (err) {
        console.error('Erreur lors du hachage du mot de passe:', err);
        throw err;
    }
  }

export default router;