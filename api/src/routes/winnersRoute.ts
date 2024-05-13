import express from "express"

import Winner from "../models/winners"

const router = express.Router()

router.get("/winners", async (req, res) => {
    try {
      const winners = await Winner.find()
      res.json(winners)
    } catch (err) {
        console.error("Erreur :", err)
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des winners" })
    }
})


export default router;