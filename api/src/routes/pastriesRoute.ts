import express from "express"

import Pastry from "../models/pastries"

const router = express.Router()


// Return the json
router.get("/pastries", async (req, res) => {
    try {
        const pastries = await Pastry.find()
        res.json(pastries)
    } catch (err) {
        console.error("Erreur :", err)
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" })
    }
})

// Return the count of pastries left
router.get("/pastries-left", async (req, res) => {
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
router.get("/pastries-img", async(req, res) => {
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

export default router;