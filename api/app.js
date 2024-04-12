import express from "express";
import mongoose from "mongoose";
import Pastry from "./models/pastries.mjs";

const app = express();
const port = 3001;

mongoose.connect('mongodb://mongo:27017/yams_db', {  // mongo:27017 pour lancer avec docker  // localhost:27017 pour lancer en local
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connexion à MongoDB réussie');
})
.catch((error) => {
  console.error('Erreur de connexion à MongoDB :', error);
});

// 1. Ajoutez une route d'accueil affichant un objet JSON contenant votre nom/prénom/age
app.get("/home", (req, res) => {
  res.send({
    nom: 'CLERYYY',
    prenom: 'Jean-Marie',
    age: 35,
  });
});

// Return the json
app.get("/pastries", async (req, res) => {
    try {
        const pastries = await Pastry.find();
        res.json(pastries);
    } catch (err) {
        console.error("Erreur :", err);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" });
    }
})

// Return the count of pastries left
app.get("/pastries-left", async (req, res) => {
    try {
        const pastries = await Pastry.find();
        var pastriesLeft = 0;
        pastries.forEach(pastry => {
            pastriesLeft += pastry.stock;
        });
        console.log(pastriesLeft);
        res.json(pastriesLeft.toString());
    } catch (err) {
        console.error("Erreur :", err);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" });
    }
})





app.listen(port, () => console.log(`App démarrée sur http://localhost:${port}`));
